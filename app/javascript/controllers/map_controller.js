import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

export default class extends Controller {
  static targets = [ "lat", "lng" ]
  static values = {
    places: Array,
    currentUserPlaces: Array
  }

  connect() {
    // Sprawdzenie czy mamy targets (formularz) czy values (widok mapy)
    if (this.hasLatTarget && this.hasLngTarget) {
      this.initializeFormMap()
    } else if (this.hasPlacesValue) {
      this.initializeViewMap()
    }
  }

  // Mapa dla widoku wyświetlającego wszystkie miejsca
  initializeViewMap() {
    // 1. Inicjalizacja mapy na całym świecie
    this.map = L.map('map').setView([20, 0], 2)

    // 2. Dodanie warstwy mapy (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map)

    // 3. Zapobieganie domyślnemu scroll wheelowi
    this.map.scrollWheelZoom.disable()

    // 4. Dodanie markerów
    this.addMarkersToViewMap()
  }

  addMarkersToViewMap() {
    const places = this.placesValue
    const currentUserPlaceIds = this.currentUserPlacesValue

    if (!places || places.length === 0) {
      return
    }

    const bounds = L.latLngBounds([])
    let hasValidCoordinates = false

    places.forEach(place => {
      const lat = parseFloat(place.latitude)
      const lng = parseFloat(place.longitude)

      if (!isNaN(lat) && !isNaN(lng)) {
        hasValidCoordinates = true
        const isOwnPlace = currentUserPlaceIds.includes(place.id)
        const color = isOwnPlace ? '#22c55e' : '#ef4444' // green for own, red for others

        // Create custom icon
        const icon = L.icon({
          iconUrl: this.getMarkerIconUrl(color),
          iconSize: [32, 41],
          iconAnchor: [16, 41],
          popupAnchor: [0, -41]
        })

        // Add marker
        const marker = L.marker([lat, lng], { icon: icon })
          .bindPopup(this.createPopupContent(place, isOwnPlace))
          .addTo(this.map)

        bounds.extend([lat, lng])
      }
    })

    // Fit map to bounds if we have valid coordinates
    if (hasValidCoordinates && bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  createPopupContent(place, isOwnPlace) {
    const visitedDate = new Date(place.visited_on)
    const formattedDate = visitedDate.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const badge = isOwnPlace 
      ? '<span class="badge badge-success text-xs">Moje miejsce</span>'
      : '<span class="badge badge-error text-xs">Inne miejsce</span>'

    return `
      <div class="space-y-2 min-w-[250px]">
        <div class="font-bold text-base">${this.escapeHtml(place.name)}</div>
        ${badge}
        <div class="text-sm text-gray-600">
          <p><strong>Adres:</strong> ${this.escapeHtml(place.address || 'N/A')}</p>
          <p><strong>Odwiedzone:</strong> ${formattedDate}</p>
          <p><strong>Dodane przez:</strong> ${this.escapeHtml(place.user_email)}</p>
        </div>
        ${place.notes ? `<div class="text-sm italic text-gray-700 border-t pt-2">${this.escapeHtml(place.notes)}</div>` : ''}
      </div>
    `
  }

  getMarkerIconUrl(color) {
    // Create SVG marker icon
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 41" width="32" height="41">
        <path fill="${color}" d="M16 0C7.2 0 0 7.2 0 16c0 8 16 25 16 25s16-17 16-25c0-8.8-7.2-16-16-16z"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `
    return 'data:image/svg+xml;base64,' + btoa(svg)
  }

  escapeHtml(text) {
    if (!text) return ''
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // ========== Mapa dla formularza ==========

  initializeFormMap() {
    if (!L) {
      console.error("Leaflet not loaded")
      return
    }

    // 1. Domyślne współrzędne (np. Warszawa)
    const defaultLat = 52.2297
    const defaultLng = 21.0122
    const defaultZoom = 13

    // Helper to initialize the map given coordinates
    const initMap = (lat, lng) => {
      // Ensure numeric values
      const nLat = Number(lat) || defaultLat
      const nLng = Number(lng) || defaultLng

      // 2. Inicjalizacja mapy
      this.map = L.map('map').setView([nLat, nLng], defaultZoom)

      // 3. Dodanie warstwy mapy (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)

      // 4. Stworzenie markera
      this.marker = L.marker([nLat, nLng], {
        draggable: true // Użytkownik może też przeciągać marker
      }).addTo(this.map)

      // 5. Obsługa zdarzeń (kliknięcie na mapę i przeciągnięcie markera)
      this.map.on('click', (e) => this.updatePosition(e.latlng.lat, e.latlng.lng))
      this.marker.on('dragend', (e) => {
        const position = e.target.getLatLng()
        this.updatePosition(position.lat, position.lng)
      })
    }

    // Pobierz wartości z inputów jeśli już istnieją (np. przy edycji), w przeciwnym razie undefined
    const inputLat = this.latTarget.value
    const inputLng = this.lngTarget.value

    // If inputs are present (editing existing place), use them immediately
    if (inputLat && inputLng) {
      initMap(inputLat, inputLng)
      return
    }

    // 2. Try to use browser geolocation if available
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          initMap(latitude, longitude)
          // populate inputs with found position
          this.latTarget.value = latitude.toFixed(6)
          this.lngTarget.value = longitude.toFixed(6)
        },
        (error) => {
          // If user denies or an error occurs, fallback to defaults
          console.warn('Geolocation error, falling back to defaults:', error)
          initMap(defaultLat, defaultLng)
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    } else {
      // No geolocation support, fallback to defaults
      initMap(defaultLat, defaultLng)
    }
  }

  // Funkcja aktualizująca marker oraz pola w formularzu
  updatePosition(lat, lng) {
    // Zaokrąglamy do 6 miejsc po przecinku (wystarczy dla GPS)
    const fixedLat = lat.toFixed(6)
    const fixedLng = lng.toFixed(6)

    // Przesuń marker na nowe miejsce
    this.marker.setLatLng([fixedLat, fixedLng])

    // Wpisz wartości do pól formularza Rails
    this.latTarget.value = fixedLat
    this.lngTarget.value = fixedLng
  }

  disconnect() {
    // Dobre praktyki: sprzątamy mapę przy opuszczaniu strony przez Turbo
    if (this.map) {
      this.map.remove()
    }
  }
}
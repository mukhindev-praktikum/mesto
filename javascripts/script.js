/* initialPlaces объявлен в places.js */

// Элементы профиля
const userProfile = document.querySelector('.profile')
const userProfileName = userProfile.querySelector('.profile__name')
const userProfileAbout = userProfile.querySelector('.profile__about')
const userProfileButtonEdit = userProfile.querySelector('.profile__edit-button')
const userProfileButtonAddPlace = userProfile.querySelector('.profile__add-button')

// Попапы
const popupProfile = document.querySelector('.popup_profile')
const popupPlace = document.querySelector('.popup_place')
const popupLightbox = document.querySelector('.popup_lightbox')
const popupButtonsClose = document.querySelectorAll('.popup__close-button')

// Форма профиля
const formProfile = popupProfile.querySelector('.popup__form')
const formInputProfileName = formProfile.querySelector('.popup__input_value_profile-name')
const formInputProfileAbout = formProfile.querySelector('.popup__input_value_profile-about')

// Форма добавления места
const formPlace = popupPlace.querySelector('.popup__form')
const formInputPlaceName = formPlace.querySelector('.popup__input_value_place-name')
const formInputPlacePhoto = formPlace.querySelector('.popup__input_value_place-photo')

// Lightbox
const lightboxPhoto = popupLightbox.querySelector('.popup__lightbox-photo')
const lightboxLabel = popupLightbox.querySelector('.popup__lightbox-label')

// Сетка карточек мест
const places = document.querySelector('.places')

// Шаблон #place
const templatePlaceCard = document.querySelector('#place').content

// Объявление пользовательского события
const eventShowForm = new Event('showForm', { bubbles: false })

// Функция: Формирование карточки
function createPlaceCard ({ name, link }) {
  const placeCard = templatePlaceCard.cloneNode(true)
  const placeName = placeCard.querySelector('.place__name')
  const placeImage = placeCard.querySelector('.place__photo')
  const placeDeleteButton = placeCard.querySelector('.place__delete-button')
  const placeLikeButton = placeCard.querySelector('.place__like')
  placeName.textContent = name
  placeImage.alt = `Фотография места ${name}`
  placeImage.src = link
  placeImage.dataset.name = name
  placeImage.dataset.link = link
  placeImage.addEventListener('click', openPhoto)
  placeLikeButton.addEventListener('click', toggleLike)
  placeDeleteButton.addEventListener('click', deletePlace)
  return placeCard
}

// Функция: Добавление карточки в DOM
function addToDom ({ card, target }) {
  target.prepend(card)
}

// Функция: Получение элемента c новой карточкой
function addPlaceCardInPlaces ({ name, link }) {
  const card = createPlaceCard({ name, link })
  addToDom({ card, target: places })
}

// Функция: Вывод карточек мест
function initRender () {
  initialPlaces.forEach(place => {
    addPlaceCardInPlaces(place)
  })
}

// Функция: Закрыть попап по клику на оверлее
function closePopupByClickOverlay (e) {
  if (e.target.classList.contains('popup')) {
    closePopup(e.target)
  }
}

// Функция: Закрывать попап по клавише Esc
function closePopupByEsc (e) {
  if (e.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened')
    closePopup(openedPopup)
  }
}

// Функция: Показать попап
function showPopup (popup) {
  document.addEventListener('keydown', closePopupByEsc)
  popup.addEventListener('mousedown', closePopupByClickOverlay)
  popup.classList.add('popup_opened')
  // Если в попапе есть форма, на ней вызывается событие "showForm"
  if (popup.querySelector('.popup__form')) {
    popup.querySelector('.popup__form').dispatchEvent(eventShowForm)
  }
}

// Функция: Закрыть всплывающее окно
function closePopup (popup) {
  if (popup.target) popup = popup.target.closest('.popup')
  if (!popup.classList.contains('popup_opened')) return
  popup.classList.remove('popup_opened')
  popup.removeEventListener('mousedown', closePopupByClickOverlay)
  document.removeEventListener('keydown', closePopupByEsc)
}

// Функция: открывает всплавающее окно
function showPopupProfile () {
  formInputProfileName.value = userProfileName.textContent
  formInputProfileAbout.value = userProfileAbout.textContent
  showPopup(popupProfile)
}

// Функция: открывает всплавающее окно и заносит в форму текщие данные
function showPopupPlace () {
  formInputPlaceName.value = ''
  formInputPlacePhoto.value = ''
  showPopup(popupPlace)
}

// Функция: Применить изменения профиля
function applyСhangesProfile (e) {
  e.preventDefault()
  userProfileName.textContent = formInputProfileName.value
  userProfileAbout.textContent = formInputProfileAbout.value
  closePopup(popupProfile)
}

// Функция: Создание новой карточки
function addPlaceCard (e) {
  e.preventDefault()
  const place = {
    name: formInputPlaceName.value,
    link: formInputPlacePhoto.value
  }
  const card = createPlaceCard(place)
  places.prepend(card)
  closePopup(popupPlace)
}

// Функция: Отобразить фото
function openPhoto (e) {
  const { name, link } = e.target.dataset
  lightboxPhoto.src = link
  lightboxPhoto.alt = name
  lightboxLabel.textContent = name
  showPopup(popupLightbox)
}

// Функция: Поставить/Снять лайк
function toggleLike (e) {
  e.target.classList.toggle('place__like_active')
}

// Функция: Удалить место
function deletePlace (e) {
  // Элемент всей карточки
  const placeCard = e.target.closest('.place')
  // Удаление слушателей с элементов карточки
  placeCard.querySelector('.place__photo').removeEventListener('click', openPhoto)
  placeCard.querySelector('.place__like').removeEventListener('click', toggleLike)
  placeCard.querySelector('.place__delete-button').removeEventListener('click', deletePlace)
  // Удаление карточки
  placeCard.remove()
}

// Слушатели
userProfileButtonEdit.addEventListener('click', showPopupProfile)
userProfileButtonAddPlace.addEventListener('click', showPopupPlace)
popupButtonsClose.forEach(button => button.addEventListener('click', closePopup))
formProfile.addEventListener('submit', applyСhangesProfile)
formPlace.addEventListener('submit', addPlaceCard)

// Инициализация
initRender()

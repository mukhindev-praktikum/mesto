import './index.css'
import {
  buttonEditProfileSelector,
  buttonAddPlaceSelector,
  nameSelector,
  aboutSelector,
  avatarSelector,
  placesContainerSelector,
  placeTemplateSelector,
  popupImageSelector,
  popupPlaceSelector,
  popupProfileSelector,
  popupAvatarSelector,
  popupDeleteSelector
} from '../utils/constants.js'
import Section from '../components/Section.js'
import Card from '../components/Card.js'
import UserInfo from '../components/UserInfo.js'
import PopupWithImage from '../components/PopupWithImage.js'
import PopupWithForm from '../components/PopupWithForm.js'
import PopupWithDelete from '../components/PopupWithDelete.js'
import FormValidator from '../components/FormValidator.js'
import { optionsValidate, configApi } from '../utils/utils.js'
import Api from '../components/Api.js'

// API
const api = new Api(configApi)

// Объявление пользовательского события, для отслеживания появления формы
const eventShowForm = new CustomEvent('showForm')

// Попап с фото места
const popupPhoto = new PopupWithImage(popupImageSelector)

// Активация слушателей попапа с фото места
popupPhoto.setEventListeners()

// Попап с удалением карточки
const popupDelete = new PopupWithDelete({
  popupSelector: popupDeleteSelector,
  handleButtonOk: ({ cardElement, cardId }) => {
    api.deleteCard(cardId)
      .then(() => {
        cardElement.remove()
      })
      .catch((error) => {
        console.log(error)
      })
  }
})

// Активация слушателей попапа c удалением
popupDelete.setEventListeners()

// Получение элемента карточки места
const getCardElement = (data, userData) => {
  const card = new Card({
    cardSelector: placeTemplateSelector,
    data,
    userData,
    handleCardClick: () => {
      popupPhoto.open(data)
    },
    handleCardDelete: ({ cardElement, cardId }) => {
      popupDelete.open({ cardElement, cardId })
    },
    handleCardLike: ({ cardId }) => {
      if (card.isLiked()) {
        api.dislikeCard(cardId)
          .then((data) => {
            card.updateLikesState(data)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        api.likeCard(cardId)
          .then((data) => {
            card.updateLikesState(data)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  })
  return card.generateCard()
}

// Секция карточек
const cards = new Section({
  containerSelector: placesContainerSelector,
  renderer: (data, userData) => {
    const cardElement = getCardElement(data, userData)
    cards.addItem(cardElement)
  }
})

// Попап с формой нового места
const popupPlace = new PopupWithForm({
  popupSelector: popupPlaceSelector,
  handleFormSubmit: (formData) => {
    const {
      popupInputPlaceName: name,
      popupInputPlacePhoto: link
    } = formData
    popupPlace.showProcess()
    api.createCard({ name, link })
      .then((data) => {
        const cardElement = getCardElement(data, user.getUserInfo())
        cards.addItem(cardElement)
        popupPlace.hideProcess()
        popupPlace.close()
      })
      .catch((error) => {
        console.log(error)
        popupPlace.hideProcess()
      })
  }
})

// Активация слушателей попапа с формой нового места
popupPlace.setEventListeners()

// Валидация формы нового места
const validateformPlace = new FormValidator(
  optionsValidate,
  popupPlace.getForm()
)
validateformPlace.enableValidation()

// Отобразить попап с формой нового места
function showPopupPlace () {
  popupPlace.open({
    // Событие которое произойдёт при открытии
    event: eventShowForm
  })
}

// 
const popupAvatar = new PopupWithForm({
  popupSelector: popupAvatarSelector,
  handleFormSubmit: (formData) => {
    const {
      popupInputAvatarPhoto: link
    } = formData
    popupAvatar.showProcess()
    api.updateAvatar(link)
      .then(() => {
        user.setUserInfo({ avatar: link })
        popupAvatar.hideProcess()
        popupAvatar.close()
      })
      .catch((error) => {
        console.log(error)
        popupPlace.hideProcess()
      })
  }
})

// 
popupAvatar.setEventListeners()

// 
const validateformAvatar = new FormValidator(
  optionsValidate,
  popupAvatar.getForm()
)
validateformAvatar.enableValidation()

//
function showPopupAvatar () {
  popupAvatar.open({
    // Событие которое произойдёт при открытии
    event: eventShowForm
  })
}

// Данные пользователя
const user = new UserInfo({
  nameSelector,
  aboutSelector,
  avatarSelector
})

// Попап с формой профиля
const popupProfile = new PopupWithForm({
  popupSelector: popupProfileSelector,
  handleFormSubmit: (formData) => {
    const {
      popupInputProfileName: name,
      popupInputProfileAbout: about
    } = formData
    popupProfile.showProcess()
    api.updateMe({ name, about })
      .then(() => {
        user.setUserInfo({ name, about })
        popupProfile.hideProcess()
        popupProfile.close()
      })
      .catch((error) => {
        console.log(error)
        popupProfile.hideProcess()
      })
  }
})

// Активация слушателей попапа с формой профиля
popupProfile.setEventListeners()

// Валидация формы профиля
const validateformProfile = new FormValidator(
  optionsValidate,
  popupProfile.getForm()
)
validateformProfile.enableValidation()

// Отобразить попап с формой профиля
function showPopupProfile () {
  const userInfo = user.getUserInfo()
  popupProfile.open({
    // Передаётся name и about в поля формы
    data: {
      popupInputProfileName: userInfo.name,
      popupInputProfileAbout: userInfo.about
    },
    // Событие которое произойдёт при открытии
    event: eventShowForm
  })
}

// Слушатели кнопок
document.querySelector(buttonAddPlaceSelector).addEventListener('click', showPopupPlace)
document.querySelector(buttonEditProfileSelector).addEventListener('click', showPopupProfile)
document.querySelector(avatarSelector).addEventListener('click', showPopupAvatar)

// Инициализация профиля и карточек
Promise.all([api.getMe(), api.getCards()])
  .then(([ userData, cardsData ]) => {
    // Установка имени пользователя и о пользователе
    user.setUserInfo(userData)
    // Рендер карточек, передача пользователя как payload
    cards.renderItems(cardsData, userData)
  })
  .catch((error) => {
    console.log(error)
  })

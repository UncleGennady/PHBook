import {
    addContactSelector,
    addContactModalTitle,
    contacts,
    contactKey,
    changeContactModalTitle,
    viewContactModalTitle,
} from './config.js';

import {
    getElement,
} from './utilities.js'

class Controller {
    #model = null;
    #view = null;
    #contactCard = null;
    #contactCardId = null;
    #filterEl = document.querySelector('#search');


    constructor(Model, View) {
        this.model = Model;
        this.view = View;

    }
    init(){
        this.#handleContactAddBtn();
        this.#addContactsEvent();
        this.#addFilterHandler();
        this.#addLoadedHandler();
    }
    // вешает событие на елемент добавления контакта
    #handleContactAddBtn() {
        getElement(addContactSelector).addEventListener('click',this.#contactAddBtnHandler)
    }

    #addLoadedHandler(){
        document.addEventListener('DOMContentLoaded',this.#loadedHandler);

    }
    #contactAddBtnHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // при добавлении новых елементов сбрасываеться фильтр
        this.#resetFilterSearch();
        const {target} = e ;
        console.dir(target);
        const addContactForm = this.#view.createAddContactForm();
        addContactForm.addEventListener('reset',this.#resetContactFormHandler);
        addContactForm.addEventListener('submit', this.#addContactFormHandler);

        this.#view.modalHeader = addContactModalTitle;
        this.#view.modalBody = addContactForm


        this.#view.openModal();

    }
    // закрывает модалку
    #resetContactFormHandler = e=> {
        e.preventDefault()
        e.stopPropagation()
        const { target } = e
        this.#view.closeModal();
        target.removeEventListener('reset', this.#addContactFormHandler);
    }

    #addContactFormHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        console.log(e)
         const { target } = e
         const inputs = target.querySelectorAll('input');
         const data = Array.from(inputs).reduce((acc,input )=>{
             acc[input.name] = input.value;
             return acc;
         }, {});

         if(data.position === '') data.position = 'не указана';
         console.dir(data);

        const savedData = this.#model.setData(data);
        console.log(savedData);

        if(!savedData.success) throw new Error('cannot save data');
        this.#view.closeModal();

        setTimeout(() => {
            this.#view.modalHeader = '';
            this.#view.clearModalBody()},150);

        target.removeEventListener('submit', this.#addContactFormHandler);

        this.#view.renderContact(savedData.data);



    }
    // срабатывает при изменении контакта
    #changeContactFormHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        console.log(e)
        const { target } = e
        const inputs = target.querySelectorAll('input');
        const data = Array.from(inputs).reduce((acc,input )=>{
            acc[input.name] = input.value;
            return acc;
        }, {});

        if(data.position === '') data.position = 'не указана';
        console.dir(data);

    // изменяет данные в lS
        const savedData = this.#model.changeData(this.#contactCardId,data)
        console.log(savedData);

        if(!savedData.success) throw new Error('cannot save data');
        this.#view.closeModal();

        setTimeout(() => {
            this.#view.modalHeader = '';
            this.#view.clearModalBody()},150);

        target.removeEventListener('submit', this.#changeContactFormHandler);
    // перерисовывает измененный контакт
        this.#view.reRenderContact( this.#contactCard, savedData.data);



    }
    // удаляет контакт
    #deleteContactFormHandler = e  => {
        if(!(e.target.id === "delete")) return;
        if(!(confirm('вы уверены ?'))) return;

        const data = this.#model.getData(contactKey)
        if(!data) return;
    // перезаписывает lS уже без контакта
        const resetData = this.#model.resetData(data, this.#contactCardId);

        this.#view.deleteElement(this.#contactCard,resetData);
        this.#view.closeModal();
        e.target.removeEventListener('click', this.#deleteContactFormHandler);

    }

    #loadedHandler = () =>{
        const data = localStorage.getItem(contactKey)
        if(!data) this.#view.renderContact(data);
        this.#view.renderContacts(data)
    }
    // добавляет слушатель к контейнеру с контактами
    #addContactsEvent() {
       getElement(contacts).addEventListener('click', this.#switchCardEventHandler)
    }

    // переключает события в замисимости от кнопки
    #switchCardEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.#contactCard = e.path.find( i => i.hasAttribute('data-id'));
        this.#contactCardId = +(this.#contactCard.getAttribute('data-id'));

        const buttonChange = e.path.find(i => {if(i.classList) return i.classList.contains('change')});
        const buttonView = e.path.find(i => {if(i.classList) return i.classList.contains('view')});
        const buttonCall = e.path.find(i => {if(i.classList) return i.classList.contains('call')});

        console.log(e.path)

        if(buttonChange) return this.#changeHandler(e);
        if(buttonView) return this.#viewHandler();
        if(buttonCall) return this.#callHandler();
    }
    // добавляет слушатели к форме измениния контакта
    #changeHandler = e =>{
        const changeContactForm = this.#view.createChangeContactForm(this.#findElData());
        changeContactForm.addEventListener('reset',this.#resetContactFormHandler);
        changeContactForm.addEventListener('submit', this.#changeContactFormHandler);
        changeContactForm.addEventListener('click', this.#deleteContactFormHandler)

        this.#view.modalHeader = changeContactModalTitle;
        this.#view.modalBody = changeContactForm;


        this.#view.openModal();
    }

    #viewHandler = () =>{

        const viewContactForm = this.#view.createViewContactForm(this.#findElData());
        viewContactForm.addEventListener('submit', this.#resetContactFormHandler);

        this.#view.modalHeader = viewContactModalTitle;
        this.#view.modalBody = viewContactForm;


        this.#view.openModal();

    }
    #callHandler = () =>{
        const data = this.#findElData()
        window.open(`tel:${data.phoneNumber}`);
    }
    // ищет елемент в данных полученых с LS
    #findElData (){
        return this.#model.getData(contactKey).find(i => i.id === (+this.#contactCardId));
    }

    #addFilterHandler(){
        let data = null;
        const contactsContainer = document.querySelector(contacts);
        // берем данные при клике на input
       this.#filterEl.addEventListener('click',(e)=>{
            e.preventDefault()
            e.stopPropagation()
            data = this.#model.getData(contactKey);
        } )
        this.#filterEl.addEventListener('keyup',event => this.filterSearchHandler(data, contactsContainer))
    }

    filterSearchHandler = (data,contactsContainer) => {
        if(!data) return;
        console.log(this.#filterEl.value);
        const arrFilterValue = this.#filterEl.value.split('');
        const lengthSearchWord = arrFilterValue.length;

        console.log(data);

        const filteredData = data.reduce((acc, item)=>{
            const name = item.contactName.split('',lengthSearchWord);
            // если длина фильтра больше чем длина слова, то слово нам не подходит
            if(name.length < lengthSearchWord) return acc;
            // сравнивает наши имена-массивы с фильтром-массивом
            const check  = () =>{
                for (let i = 0; i <= lengthSearchWord - 1 ; i ++) {
                    if(name[i] !== arrFilterValue[i] ) return false;
                }
                return true;
            }

            if(check()) acc.push(item);

            return acc;
        }, [])
        console.log(filteredData);
        // отображаем отфильтрованые контакты
        this.#view.renderFilterContacts(filteredData, contactsContainer);
    }
// при добавлении новых елементов сбрасываеться фильтр
    #resetFilterSearch=() =>{
        if(this.#filterEl.value === "") return;
        this.#filterEl.value  = "";
        const data = this.#model.getData(contactKey)
        this.#view.renderContacts(data);
    }




    set model(modelClass){
        if(!modelClass) throw new Error('model is invalid')
        this.#model = new modelClass()
    }

    set view(modelClass){
        if(!modelClass) throw new Error('view is invalid')
        this.#view = new modelClass()
    }
}

export default Controller;
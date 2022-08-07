import {
    contacts,
    contactsAreEmptyText
} from './config.js';

import {
    getElement
} from './utilities.js';
class View {
    #modal = null;
    #modalHeader = null;
    #modalBody = null;
    constructor() {
        const modalWindow = this.#createModal();
        this.#modal = new bootstrap.Modal(modalWindow, {
            backdrop:'static'
        })
    }
    openModal(){
        this.#modal.show();
    };
    closeModal(){
        this.#modal.hide();

    }
    #createModal(){
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = 'modal'
        modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        
                        </div>
                        <div class="modal-body">
                           
                        </div>
                    </div>
                </div>`

        this.#modalHeader = modal.querySelector('.modal-header');
        this.#modalBody = modal.querySelector('.modal-body');
        document.body.append(modal)
        return modal;
    }
    createAddContactForm(){
        const form = document.createElement('form');
        form.innerHTML = `
                <div class="mb-3">
                  <label for="contact-name" class="form-label">Contact name</label>
                  <input name="contactName" required type="text" class="form-control" id="contact-name" placeholder="John Doe">
                </div>
                <div class="mb-3">
                  <label for="phone-number" class="form-label">Phone number</label>
                  <input type="tel"  required name="phoneNumber" class="form-control" id="phone-number" placeholder="666-666-66-6">
                </div>
                 <div class="mb-3">
                  <label for="position" class="form-label">Position</label>
                  <input type="text" name="position" class="form-control" id="position" placeholder="Developer">
                </div>
                <div>
                    <button class="btn btn-success" type="submit">Add Contact</button>
                    <button class="btn btn-danger" type="reset">Cancel</button>
                </div>`;
        return form;
    }
    createChangeContactForm(data){
        const form = document.createElement('form');
        form.innerHTML = `
                <div class="mb-3">
                  <label for="contact-name" class="form-label">Contact name</label>
                  <input name="contactName" required type="text" class="form-control" id="contact-name" placeholder="John Doe" value = "${data.contactName}">
                </div>
                <div class="mb-3">
                  <label for="phone-number" class="form-label">Phone number</label>
                  <input type="tel"  required name="phoneNumber" class="form-control" id="phone-number" placeholder="666-666-66-6" value = "${data.phoneNumber}">
                </div>
                 <div class="mb-3">
                  <label for="position" class="form-label">Position</label>
                  <input type="text" name="position" class="form-control" id="position" placeholder="Developer" value = "${data.position}">
                </div>
                <div class="d-flex justify-content-around flex-wrap gap-3">
                    <button class="btn btn-success" type="submit">Change Contact</button>
                    <button class="btn btn-warning" type="reset">Close Contact</button>
                    
                    <div class="btn btn-danger" id="delete">Delete Contact</div>
                    
                </div>`;
        return form;
    }

    createViewContactForm(data){
        const form = document.createElement('form');
        form.innerHTML = `
                <div class="mb-3">
                   Имя: ${data.contactName}
                </div>
                <div class="mb-3">
                 Телефон: ${data.phoneNumber}
                </div>
                 <div class="mb-3">
                 Кем работает: ${data.position}
                </div>
                <div>
                    <button class="btn btn-success" type="submit">Сlose</button>
                </div>`;
        return form;

    }

    clearModalBody(){
        this.#modalBody.innerHTML = '';
    }

    #createContact(data){
        console.log(data);
        if(!data) return document.createElement('div').innerText = contactsAreEmptyText;

        const contact = document.createElement('div');
        contact.classList.add('card')
        contact.setAttribute('data-id', data.id);
        contact.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div class="contact-name">${data.contactName}</div>
                        <div class="phone-number">${data.phoneNumber}</div>
                        <div class="position">${data.position}</div>

                        <div class="contact-controls">
                            <button class="btn btn-warning btn-sm change">
                                <i class="bi bi-pencil "></i>
                            </button>
                            <button class="btn btn-primary btn-sm view">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-success btn-sm call">
                                <i class="bi bi-telephone-fill"></i>
                            </button>
                        </div>
                    </div>
        `
        return contact
    }

    renderContact(dataToRender){
        const contactsContainer = getElement(contacts);
        if(contactsContainer.innerText === contactsAreEmptyText) contactsContainer.innerText = '';
        contactsContainer.append(this.#createContact(dataToRender));
    }
    reRenderContact(el, dataToRender){
        el.innerHTML = this.#createContact(dataToRender).innerHTML;
    }

    deleteElement = (el,data) => {
        el.remove();
        if(!(data.length)) return getElement(contacts).innerText = contactsAreEmptyText;
    };

    renderFilterContacts(data, container){
        if(!data) return;
        container.innerHTML = '';
        if(!data.length) container.innerHTML = 'нет контактов по данному фильтру '
        data.forEach(item =>container.append(this.#createContact(item)));
    }

    renderContacts(data){
        if(!data) return;
        if(typeof data === 'string') data = JSON.parse(data)
        const contactsContainer = getElement(contacts);
        contactsContainer.innerHTML = "";
        console.log(data);
        console.log(123);
        data.forEach(item =>contactsContainer.append(this.#createContact(item)));
    }

    set modalHeader (value){
        if(typeof value !== 'string') throw new Error('modalHeader must been str');
        this.#modalHeader.innerHTML = value;
    }
    set modalBody (value){
        if(!(value instanceof HTMLFormElement)) throw new Error('modalBody must been str');
        this.#modalHeader.append(value);
    }


}

export default View;
'use strict';

import Controller from "./PhoneBook/Controller.js";
import View from './PhoneBook/View.js';
import Model from './PhoneBook/Model.js';


const app = new Controller(Model, View);
app.init();
console.log(app)
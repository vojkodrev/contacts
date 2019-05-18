import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ContactsService, IContact } from 'src/app/services/contacts/contacts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export enum AddEditMode {
  Add,
  Edit
}

export enum DeleteMode {
  Confirm,
  Normal
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  contacts: IContact[];

  addEditContact: IContact;
  editIndex: number;
  addEditMode: AddEditMode;
  @ViewChild("addEditContactModal") addEditContactModal;

  deleteButtonText: string;
  deleteMode: DeleteMode;

  constructor(
    private contactsService: ContactsService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.contacts = this.contactsService.getAll();
  }

  startEditingContact(contact: IContact, index: number) {
    this.editIndex = index;
    this.addEditMode = AddEditMode.Edit;
    this.addEditContact = Object.assign({}, contact);
    this.deleteButtonText = "Delete";
    this.deleteMode = DeleteMode.Normal;
    this.openAddEditContactModal();
  }

  startAddingContact() {
    this.addEditMode = AddEditMode.Add;
    this.addEditContact = {
      email: "",
      name: "",
      phoneNumber: ""
    };
    this.openAddEditContactModal();
  }

  openAddEditContactModal() {
    this.modalService.open(this.addEditContactModal, {ariaLabelledBy: 'modal-basic-title'})
      // .result.then((result) => {
      //   console.log("closed with", result);
      // }, (reason) => {
      //   console.log("closed with error", reason);
      // });
  }

  saveContact(modal) {
    if (this.addEditMode == AddEditMode.Add) {
      this.contactsService.add(this.addEditContact.name, this.addEditContact.email, this.addEditContact.phoneNumber);
      this.contacts.splice(0, 0, Object.assign({}, this.addEditContact));
    } else if (this.addEditMode == AddEditMode.Edit) {
      this.contactsService.edit(this.editIndex, this.addEditContact.name, this.addEditContact.email, this.addEditContact.phoneNumber);
      this.contacts[this.editIndex] = Object.assign({}, this.addEditContact);
    }

    modal.close("save clicked");
  }

  deleteContact(modal) {

    if (this.deleteMode == DeleteMode.Normal) {
      this.deleteButtonText = "Are you sure?";
      this.deleteMode = DeleteMode.Confirm;
    } else if (this.deleteMode == DeleteMode.Confirm) {
      this.contactsService.remove(this.editIndex);
      this.contacts.splice(this.editIndex, 1);
      modal.close("delete clicked");
    }
  }
}

import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ContactsService, IContact } from 'src/app/services/contacts/contacts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

enum AddEditMode {
  Add,
  Edit
}

enum DeleteMode {
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
    // private route: ActivatedRoute,
    // private router: Router,
    private contactsService: ContactsService,
    private modalService: NgbModal,
    // private ngZone: NgZone,
  ) { }

  ngOnInit() {
    
    console.log("contacts on init")
    
    this.contacts = this.contactsService.getAll();

    // setInterval(() => {
    //   console.log("addEditForm", this.addEditForm);
    // }, 1000)
    
    // this.route.paramMap.subscribe(i => {      
    //   console.log(new Date(), "params changed");
    //   console.log(i, );
    // })

    // this.route.url.subscribe(url => {
    //   console.log(url)

    //   if (url.length < 2)
    //     return;

    //   if (url[1].path == "add") {
    //     setTimeout(() => {
          
    //     }, 0);
    //     this.ngZone.run(() => {
          
    //     });
    //   }
    // });

    console.log(this.contactsService);
    console.log(this.contactsService.getAll());

    console.log("addEditContactModal", this.addEditContactModal);

    // this.contactsService.edit(2, "moo", "a", "B");
  }

  startEditingContact(contact: IContact, index: number) {
    console.log("start editing contact", contact, index);
    
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
    console.log("opening modal", this.addEditContactModal);
    this.modalService.open(this.addEditContactModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log("closed with", result);
    }, (reason) => {
      console.log("closed with error", reason);
    });
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

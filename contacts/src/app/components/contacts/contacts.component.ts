import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ContactsService, IContact } from 'src/app/services/contacts/contacts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

enum AddEditMode {
  Add,
  Edit
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  contacts: IContact[];

  addEditItem: IContact;
  editIndex: number;
  addEditMode: AddEditMode;
  @ViewChild("addEditContactModal") addEditContactModal;

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
    this.addEditItem = Object.assign({}, contact);
    this.openAddEditContactModal();
  }

  startAddingContact() {
    this.addEditMode = AddEditMode.Add;
    this.addEditItem = {
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
      this.contactsService.add(this.addEditItem.name, this.addEditItem.email, this.addEditItem.phoneNumber);
      this.contacts.splice(0, 0, Object.assign({}, this.addEditItem));
    } else if (this.addEditMode == AddEditMode.Edit) {
      this.contactsService.edit(this.editIndex, this.addEditItem.name, this.addEditItem.email, this.addEditItem.phoneNumber);
      this.contacts[this.editIndex] = Object.assign({}, this.addEditItem);
    }

    modal.close("save clicked");
  }

}

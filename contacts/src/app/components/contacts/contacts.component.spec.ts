import { ContactsComponent, AddEditMode, DeleteMode } from './contacts.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService, IContact } from 'src/app/services/contacts/contacts.service';
import { TestBed } from '@angular/core/testing';

describe('ContactsComponent', () => {

  let contactsComponent: ContactsComponent;
  let contactsServiceSpy: jasmine.SpyObj<ContactsService>;
  let ngbModalSpy: jasmine.SpyObj<NgbModal>;
  let modalSpy;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        ContactsComponent,
        { provide: NgbModal, useValue: jasmine.createSpyObj('NgbModal', ['open']) },
        { provide: ContactsService, useValue: jasmine.createSpyObj('ContactsService', ['getAll', 'add', 'edit', 'remove']) },
      ]
    })

    contactsComponent = TestBed.get(ContactsComponent);    
    contactsServiceSpy = TestBed.get(ContactsService);    
    ngbModalSpy = TestBed.get(NgbModal);    

    modalSpy = jasmine.createSpyObj(["close"]);
  });

  it('should set correct components varibles and open add edit modal when edit contact is clicked', () => {

    let contact: IContact = {name: "Vojko Drev", email: "vd@cc.cc", phoneNumber: "111"};

    contactsComponent.startEditingContact(contact, 0);

    expect(contactsComponent.editIndex).toBe(0);
    expect(contactsComponent.addEditMode).toBe(AddEditMode.Edit);
    expect(contactsComponent.addEditContact.name).toBe("Vojko Drev");
    expect(contactsComponent.addEditContact.email).toBe("vd@cc.cc");
    expect(contactsComponent.addEditContact.phoneNumber).toBe("111");
    expect(contactsComponent.addEditContact).not.toBe(contact);
    expect(contactsComponent.deleteButtonText).toBe("Delete");
    expect(contactsComponent.deleteMode).toBe(DeleteMode.Normal);
    expect(ngbModalSpy.open.calls.mostRecent()).toBeDefined();
  });

  it('should set correct components varibles and open add edit modal when add contact is clicked', () => {

    contactsComponent.startAddingContact();

    expect(contactsComponent.addEditMode).toBe(AddEditMode.Add);
    expect(contactsComponent.addEditContact).toBeDefined();
    expect(ngbModalSpy.open.calls.mostRecent()).toBeDefined();
  });

  
  it('should set contacts on init when contacts service get all returns contacts', () => {

    contactsServiceSpy.getAll.and.returnValue([{name: "Vojko Drev", email: "vd@cc.cc", phoneNumber: "111"}]);

    contactsComponent.ngOnInit();

    expect(contactsComponent.contacts.length).toBe(1);
    expect(contactsComponent.contacts[0].name).toBe("Vojko Drev");
  });

  it('should add a contact to service and contacts list when contact is saved in add mode', () => {

    contactsComponent.addEditMode = AddEditMode.Add;
    contactsComponent.addEditContact = {name: "Vojko Drev", email: "vd@cc.cc", phoneNumber: "111"};
    contactsComponent.contacts = [];
    
    contactsComponent.saveContact(modalSpy);

    expect(modalSpy.close.calls.mostRecent()).toBeDefined();
    expect(contactsServiceSpy.add.calls.mostRecent().args[0]).toBe("Vojko Drev");
    expect(contactsComponent.contacts.length).toBe(1);
    expect(contactsComponent.contacts[0]).toEqual(contactsComponent.addEditContact);
    expect(contactsComponent.contacts[0]).not.toBe(contactsComponent.addEditContact);
  });

  it('should call service edit method and replace contact at correct index when contact is saved in edit mode', () => {

    contactsComponent.addEditMode = AddEditMode.Edit;
    contactsComponent.editIndex = 0;
    contactsComponent.addEditContact = {name: "Vojko Drev", email: "vd@cc.cc", phoneNumber: "111"};
    contactsComponent.contacts = [{name: "Michael", email: "", phoneNumber: ""}];
    
    contactsComponent.saveContact(modalSpy);

    expect(modalSpy.close.calls.mostRecent()).toBeDefined();
    expect(contactsServiceSpy.edit.calls.mostRecent().args[0]).toBe(0);
    expect(contactsServiceSpy.edit.calls.mostRecent().args[1]).toBe("Vojko Drev");
    expect(contactsServiceSpy.edit.calls.mostRecent().args[2]).toBe("vd@cc.cc");
    expect(contactsServiceSpy.edit.calls.mostRecent().args[3]).toBe("111");
    expect(contactsComponent.contacts.length).toBe(1);
    expect(contactsComponent.contacts[0]).toEqual(contactsComponent.addEditContact);
    expect(contactsComponent.contacts[0]).not.toBe(contactsComponent.addEditContact);
  });  

  it('should set delete mode to confirm and change delete button text but not close modal when contact is deleted', () => {

    contactsComponent.deleteMode = DeleteMode.Normal;
    
    contactsComponent.deleteContact(modalSpy);

    expect(contactsComponent.deleteButtonText).toBe("Are you sure?");
    expect(contactsComponent.deleteMode).toBe(DeleteMode.Confirm);
    expect(modalSpy.close.calls.mostRecent()).not.toBeDefined();
  });  

  it('should set delete mode to confirm and change delete button text but not close modal when contact is deleted', () => {

    contactsComponent.deleteMode = DeleteMode.Normal;
    
    contactsComponent.deleteContact(modalSpy);

    expect(contactsComponent.deleteButtonText).toBe("Are you sure?");
    expect(contactsComponent.deleteMode).toBe(DeleteMode.Confirm);
    expect(modalSpy.close.calls.mostRecent()).not.toBeDefined();
  });  

  it('should remove contact from service, contacts list and close modal when contact is deleted and delete mode is confirm', () => {

    contactsComponent.deleteMode = DeleteMode.Confirm;
    contactsComponent.editIndex = 0;
    contactsComponent.contacts = [{name: "Vojko Drev", email: "vd@cc.cc", phoneNumber: "111"}];
    
    contactsComponent.deleteContact(modalSpy);

    expect(contactsComponent.contacts.length).toBe(0);
    expect(contactsServiceSpy.remove.calls.mostRecent().args[0]).toBe(0);
    expect(modalSpy.close.calls.mostRecent()).toBeDefined();
  });  
});

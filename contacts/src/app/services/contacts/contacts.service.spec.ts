import { TestBed } from '@angular/core/testing';

import { ContactsService, CONTACTS_STORAGE, IContact } from './contacts.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

describe('ContactsService', () => {
  
  let contactsService: ContactsService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  const setup = (localStorageGetItemValues: string = undefined) => {

    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'removeItem', 'setItem']);
    localStorageServiceSpy.getItem.and.returnValue(localStorageGetItemValues);

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceSpy }
      ]
    })

    contactsService = TestBed.get(ContactsService);
  }

  const checkIfDefaultValuesWereSet = (localStorageGetItemValues: string = undefined) => {
    setup(localStorageGetItemValues);
    
    let setItemCall = localStorageServiceSpy.setItem.calls.mostRecent();

    expect(setItemCall.args.length).toBe(2);
    expect(setItemCall.args[0]).toBe(CONTACTS_STORAGE);
    expect(setItemCall.args[1].indexOf(`[{"name":"Leonardo da Vinci","email":"leonar`)).toBe(0);
  }

  it('should set default values to local storage when contacts service is created', () => {
    checkIfDefaultValuesWereSet();
  });

  it('should set default values to local storage when current values set is not an array', () => {
    checkIfDefaultValuesWereSet("{}");
  }); 
  
  it('should not set default values to local storage when they are already set', () => {
    setup(`[{"name": "Leonardo da Vinci", "email": "leonardo@e-mail.com", "phoneNumber": "202-555-0166"}]`);
    
    expect(localStorageServiceSpy.setItem.calls.any()).not.toBeTruthy();
  });  

  it('should return 3 items when only getAll is called', () => {
    setup(`[
      {"name": "Leonardo da Vinci", "email": "leonardo@e-mail.com", "phoneNumber": "202-555-0166"},
      {"name": "Leonardo da Vinci", "email": "leonardo@e-mail.com", "phoneNumber": "202-555-0166"},
      {"name": "Leonardo da Vinci", "email": "leonardo@e-mail.com", "phoneNumber": "202-555-0166"}
    ]`);
    
    const items = contactsService.getAll();

    expect(items.length).toBe(3);
  });  

  it('should contain contact for Vojko Drev when it is added', () => {
    setup("[]");
    
    contactsService.add("Vojko Drev", "vojkodrev@111", "1111");

    expect(localStorageServiceSpy.setItem.calls.mostRecent().args[1].indexOf("Vojko Drev")).not.toBe(-1);
  });  

  it('should contain an empty array when the only item is removed', () => {
    setup(`[
      {"name": "Leonardo da Vinci", "email": "leonardo@e-mail.com", "phoneNumber": "202-555-0166"}
    ]`);
    
    contactsService.remove(0);

    let setItemCall = localStorageServiceSpy.setItem.calls.mostRecent();

    expect(setItemCall.args[0]).toBe(CONTACTS_STORAGE);
    expect(setItemCall.args[1]).toBe("[]");
  });   

  it('should contain Vojko Drev string when item is edited', () => {
    setup(`[
      {"name": "Leonardo da Vinci", "email": "leonardo@e-mail.com", "phoneNumber": "202-555-0166"}
    ]`);
    
    contactsService.edit(0, "Vojko Drev", "", "");

    let setItemCall = localStorageServiceSpy.setItem.calls.mostRecent();

    expect(setItemCall.args[0]).toBe(CONTACTS_STORAGE);
    expect(setItemCall.args[1].indexOf("Vojko Drev")).not.toBe(-1);
  });  
});

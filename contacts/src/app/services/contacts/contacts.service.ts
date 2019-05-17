import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

export const CONTACTS_STORAGE = "CONTACTS";

export interface IContact {
  name: string;
  email: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(
    private localStorageService: LocalStorageService
  ) { 
    if (!localStorageService.getItem(CONTACTS_STORAGE)) {
      this.save([
        {"name": "Leonardo da Vinci", "email": "leonardo@e-mail.com", "phoneNumber": "202-555-0166"},
        {"name": "William Shakespeare", "email": "william@e-mail.com", "phoneNumber": "202-555-0157"},
        {"name": "Pablo Picasso", "email": "pablo@e-mail.com", "phoneNumber": "202-555-0180"},
        {"name": "Albert Einstein", "email": "albert@e-mail.com", "phoneNumber": "202-555-0131"},
        {"name": "Oscar Wilde", "email": "oscar@e-mail.com", "phoneNumber": "202-555-0184"},
        {"name": "Christopher Columbus", "email": "christoper@e-mail.com", "phoneNumber": "202-555-0190"},
        {"name": "Charles Darwin", "email": "charles@e-mail.com", "phoneNumber": "202-555-0181"},
        {"name": "Thomas Edison", "email": "thomas@e-mail.com", "phoneNumber": "202-555-0133"},
        {"name": "Abraham Lincoln", "email": "abraham@e-mail.com", "phoneNumber": "202-555-0198"},
        {"name": "Vincent Van Gogh", "email": "vincent@e-mail.com", "phoneNumber": "202-555-0104"}
      ]);
    }
  }

  public getAll(): IContact[] {
    return JSON.parse(this.localStorageService.getItem(CONTACTS_STORAGE));
  }

  private save(contacts: IContact[]) {
    return this.localStorageService.setItem(CONTACTS_STORAGE, JSON.stringify(contacts));
  }

  public add(name: string, email: string, phoneNumber: string) {
    const all = this.getAll();
    
    const item:IContact = {
      email: email,
      phoneNumber: phoneNumber,
      name: name
    };

    all.splice(0, 0, item);

    this.save(all);
  }

  public remove(index: number) {
    const all = this.getAll();
    all.splice(index, 1);

    this.save(all);
  }

  public edit(index: number, name: string, email: string, phoneNumber: string) {
    const all = this.getAll();
    const item = all[index];

    item.email = email;
    item.name = name;
    item.phoneNumber = phoneNumber;

    this.save(all);
  }
}

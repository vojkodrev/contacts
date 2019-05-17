import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContactsService } from 'src/app/services/contacts/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactsService
  ) { }

  ngOnInit() {
    console.log("contacts on init")
    this.route.paramMap.subscribe(i => {
      console.log(new Date(), "params changed");
      console.log(i);
    })

    console.log(this.contactsService);
    console.log(this.contactsService.getAll());

    // this.contactsService.edit(2, "moo", "a", "B");
  }

}

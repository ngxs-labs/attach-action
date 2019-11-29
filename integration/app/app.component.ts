import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RootState, UpdateTitleAction } from './state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @Select(RootState.tilte)
  public title$!: Observable<string>;

  constructor(private store: Store) {}

  public changeTitle() {
    return this.store.dispatch(new UpdateTitleAction('Updated Title'));
  }
}

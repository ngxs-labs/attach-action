import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RootState, UpdateSubtitleAction, UpdateTitleAction } from './state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @Select(RootState.title)
  public title$!: Observable<string>;

  @Select(RootState.subTitle)
  public subTitle$!: Observable<string>;

  constructor(private store: Store) {}

  public changeTitle() {
    return this.store.dispatch(new UpdateTitleAction('Updated Title'));
  }

  public changeSubTitle() {
    return this.store.dispatch(new UpdateSubtitleAction('Updated Subtitle'));
  }
}

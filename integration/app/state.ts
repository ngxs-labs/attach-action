import { StateContext, State, Selector } from '@ngxs/store';
import { RootStateModel } from './app.module';
import { attachAction } from 'src/public-api';

// actions
export class UpdateTitleAction {
  static readonly type = '[Root] Update Title';
  constructor(public title: string) {}
}

// actionHandler
const updateTitleActionHandler = (ctx: StateContext<RootStateModel>, action: UpdateTitleAction) =>
  ctx.patchState({ title: action.title });

// state
@State<RootStateModel>({
  name: 'RootStore',
  defaults: {
    title: 'First Title'
  }
})
export class RootState {
  constructor() {
    attachAction(RootState, UpdateTitleAction, updateTitleActionHandler);
  }

  @Selector()
  public static tilte(state: RootStateModel) {
    return state.title;
  }
}

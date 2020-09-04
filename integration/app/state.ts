import { StateContext, State, Selector, Action } from '@ngxs/store';
import { RootStateModel } from './app.module';
import { attachAction, attachActionProvider } from 'src/public-api';

// actions
export class UpdateTitleAction {
  static readonly type = '[Root] Update Title';
  constructor(public title: string) {}
}

export class UpdateSubtitleAction {
  static readonly type = '[Root] Update Subtitle';
  constructor(public subTitle: string) {}
}

// actionHandler
const updateTitleActionHandler = (ctx: StateContext<RootStateModel>, action: UpdateTitleAction) =>
  ctx.patchState({ title: action.title });

// actionProvider
class ActionProvider {
  @Action(UpdateSubtitleAction)
  updateSubtitleAction(ctx: StateContext<RootStateModel>, action: UpdateSubtitleAction) {
    ctx.patchState({ subTitle: action.subTitle });
  }
}

// state
@State<RootStateModel>({
  name: 'RootStore',
  defaults: {
    title: 'First Title',
    subTitle: 'Second Title'
  }
})
export class RootState {
  constructor() {
    attachAction(RootState, UpdateTitleAction, updateTitleActionHandler);
    attachActionProvider(RootState, [ActionProvider]);
  }

  @Selector()
  public static title(state: RootStateModel) {
    return state.title;
  }

  @Selector()
  public static subTitle(state: RootStateModel) {
    return state.subTitle;
  }
}

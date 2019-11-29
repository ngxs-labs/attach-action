import { Actions, NgxsModule, ofActionDispatched, State, StateContext, Store } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { attachAction } from '../lib/attach-action';

describe('attach-action', () => {
  @State<{}>({
    name: 'attachActionStore',
    defaults: {
      name: 'morpheus'
    }
  })
  class AttachActionStore {}

  const Action = {
    A: { type: 'actionA' },
    B: { type: 'actionB' }
  };

  let store: Store;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AttachActionStore])]
    });

    store = TestBed.get(Store);
    actions$ = TestBed.get(Actions);
  });

  describe('attachAction()', () => {
    it('registers a new action on the store', () => {
      let counter = 0;
      const actionHandler = () => counter++;

      attachAction(AttachActionStore, Action.A, actionHandler);
      store.dispatch(Action.A);

      expect(counter).toBe(1);
    });

    it('combines multiple actions to one handler on the store', () => {
      let counter = 0;
      const actionHandler = () => counter++;

      attachAction(AttachActionStore, [Action.A, Action.B], actionHandler);
      store.dispatch(Action.A);
      store.dispatch(Action.B);

      expect(counter).toBe(2);
    });

    it('registers a new action on the store, which update the store', () => {
      const expectedName = 'davinci';

      attachAction(AttachActionStore, [Action.A], (ctx: StateContext<AttachActionStore>) => {
        ctx.patchState({ name: expectedName });
      });
      store.dispatch(Action.A);

      const actualName = store.selectSnapshot(s => s.attachActionStore.name);
      expect(actualName).toBe('davinci');
    });

    it('registers a new action on the store, which will also triggers Action Handlers', () => {
      let actionHandlerTriggered = 0;
      actions$.pipe(ofActionDispatched(Action.A)).subscribe(() => {
        actionHandlerTriggered++;
      });

      attachAction(AttachActionStore, [Action.A], () => {});
      store.dispatch(Action.A);

      expect(actionHandlerTriggered).toBe(1);
    });

    it('throws Error if no valid store is provided', () => {
      const invalidStore = {};
      const attachActionWithValidStore = () =>
        attachAction(invalidStore, [Action.A, Action.B], () => {});

      expect(attachActionWithValidStore).toThrow();
    });
  });
});

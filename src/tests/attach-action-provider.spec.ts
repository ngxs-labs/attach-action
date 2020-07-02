import { TestBed } from '@angular/core/testing';
import { Action, NgxsModule, State, StateContext, Store } from '@ngxs/store';
import { attachActionProvider } from '../lib/attach-action-provider';

interface StoreModel {
  mutationStoreAction: string;
  mutationProvidedAction: string;
}
class StoreAction {
  static readonly type = '[StoreAction] Type ';
  constructor(public value: string) {}
}

class ProvidedAction {
  static readonly type = '[ProvidedAction] Type';
  constructor(public value: string) {}
}

@State<StoreModel>({
  name: 'testStore',
  defaults: {
    mutationStoreAction: '',
    mutationProvidedAction: ''
  }
})
class TestStore {
  constructor() {
    attachActionProvider(TestStore, [ActionProvider]);
  }

  @Action(StoreAction)
  mutateByStoreAction(context: StateContext<StoreModel>, action: StoreAction) {
    context.patchState({ mutationStoreAction: action.value });
  }
}

class ActionProvider {
  @Action(ProvidedAction)
  mutateByProvidedAction(context: StateContext<StoreModel>, action: ProvidedAction) {
    context.patchState({ mutationProvidedAction: action.value });
  }
}

describe('attach-action-provider', () => {
  let store: Store;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TestStore])]
    });
    store = TestBed.get(Store);
  });

  it('should mutate state with provided action', () => {
    const mutationValue = 'mutation_value';
    store.dispatch(new ProvidedAction(mutationValue));
    const storeSnapshote: StoreModel = store.selectSnapshot(s => s.testStore);
    expect(storeSnapshote.mutationProvidedAction).toBe(mutationValue);
  });

  it('should still mutate state with store action', () => {
    const mutationValue = 'mutation_value';
    store.dispatch(new StoreAction(mutationValue));
    const storeSnapshote: StoreModel = store.selectSnapshot(s => s.testStore);
    expect(storeSnapshote.mutationStoreAction).toBe(mutationValue);
  });
});

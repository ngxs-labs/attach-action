import { TestBed } from '@angular/core/testing';
import { Action, NgxsModule, State, StateContext, Store } from '@ngxs/store';
import { attachActionProvider } from '../lib/attach-action-provider';
import { Injectable } from '@angular/core';

interface StoreModel {
  mutationStoreAction: string;
  mutationProvidedAction: string;
}
class StoreAction {
  static readonly type = '[TestStore] Store Action ';
  constructor(public value: string) {}
}

class ProvidedAction {
  static readonly type = '[TestStore] Provided Action';
  constructor(public value: string) {}
}

class SecondProvidedAction {
  static readonly type = '[TestStore] Second Provided Action';
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
    attachActionProvider(TestStore, [ActionProvider, SecondActionProvider]);
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

@Injectable({
  providedIn: 'root'
})
class SecondActionProvider {
  @Action(SecondProvidedAction)
  mutateBySecondProvidedAction(context: StateContext<StoreModel>, action: ProvidedAction) {
    context.patchState({ mutationProvidedAction: action.value });
  }
}

describe('attach-action-provider', () => {
  let store: Store;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TestStore])],
      providers: [
        {
          provide: ActionProvider,
          useClass: ActionProvider
        }
      ]
    });
    store = TestBed.get(Store);
  });

  it('should mutate state with provided action', () => {
    const mutationValue = 'mutation_value';
    const secondMutationValue = 'second_mutation_value';
    //First
    store.dispatch(new ProvidedAction(mutationValue));
    let storeSnapshote: StoreModel = store.selectSnapshot(s => s.testStore);
    expect(storeSnapshote.mutationProvidedAction).toBe(mutationValue);
    //Second
    store.dispatch(new SecondProvidedAction(secondMutationValue));
    storeSnapshote = store.selectSnapshot(s => s.testStore);
    expect(storeSnapshote.mutationProvidedAction).toBe(secondMutationValue);
  });

  it('should still mutate state with store action', () => {
    const mutationValue = 'mutation_value';
    store.dispatch(new StoreAction(mutationValue));
    const storeSnapshote: StoreModel = store.selectSnapshot(s => s.testStore);
    expect(storeSnapshote.mutationStoreAction).toBe(mutationValue);
  });
});

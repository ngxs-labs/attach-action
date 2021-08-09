import { Action, StateContext } from '@ngxs/store';
import { ActionHandlerMetaData } from '@ngxs/store/src/actions/symbols';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { META_KEY, META_OPTIONS_KEY } from './const';

export function attachActionProvider(storeClass: any, providers: any[]): void {
  if (!storeClass[META_OPTIONS_KEY]) {
    throw new Error('storeClass is not a valid NGXS Store');
  }
  providers.forEach(provider => {
    const providedActions: ActionHandlerMetaData[] = parseProvidedActions(provider);
    providedActions.forEach(providedAction => {
      attachToStoreClass(storeClass, provider, providedAction);
    });
  });
}

const parseProvidedActions = (provider: any): ActionHandlerMetaData[] => {
  const metaDataModel: MetaDataModel = provider[META_KEY];
  if (!metaDataModel) {
    throw new Error('provider is not a valid NGXS Action Provider');
  }
  const actions: ActionHandlerMetaData[][] = Object.values(metaDataModel.actions);
  return flattenDeep(actions);
};

const flattenDeep = (arr: any): any =>
  Array.isArray(arr) ? arr.reduce((a, b) => a.concat(flattenDeep(b)), []) : [arr];

const attachToStoreClass = (
  storeClass: any,
  provider: any,
  action: ActionHandlerMetaData
): void => {
  Action({ type: action.type }, action.options)({ constructor: storeClass }, action.fn.toString());
  const delegateDescriptor = createDelegateDescriptor(provider, action);
  Object.defineProperty(storeClass.prototype, action.fn, delegateDescriptor);
};

const createDelegateDescriptor = (
  provider: any,
  action: ActionHandlerMetaData
): PropertyDescriptor => {
  const providerPropertyDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
    provider.prototype,
    action.fn
  ) as PropertyDescriptor;

  const delegate = (stateContext: StateContext<any>, actionParam: any) =>
    providerPropertyDescriptor.value.apply(provider.prototype, [stateContext, actionParam]);

  return {
    ...providerPropertyDescriptor,
    value: delegate
  };
};

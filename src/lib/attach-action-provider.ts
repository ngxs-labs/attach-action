import { Action, StateContext } from '@ngxs/store';
import { ActionHandlerMetaData } from '@ngxs/store/src/actions/symbols';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import * as lodash from 'lodash';

const META_KEY = 'NGXS_META';
const META_OPTIONS_KEY = 'NGXS_OPTIONS_META';

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
  return lodash.flattenDeep(actions);
};

const attachToStoreClass = (
  storeClass: any,
  provider: any,
  action: ActionHandlerMetaData
): void => {
  if (Object.getOwnPropertyNames(storeClass.prototype).includes(action.fn.toString())) {
    throw Error(`Duplicate method ${action.fn.toString()} between ${storeClass} and ${provider}`);
  }
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

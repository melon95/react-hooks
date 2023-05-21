import FetchRequest from "../fetch";
import { Options } from "./useRequest";

export interface PluginReturn<TData, TParams> {
  onBefore?: (params: TParams) => unknown;
  onCancel?: () => void;
  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
  onRequest?: () => void;
}

export interface Plugin<TData, TParams> {
  (fetchIns: FetchRequest<TData, TParams>, options: Options<TData, TParams>): PluginReturn<TData, TParams>;
}
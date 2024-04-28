type CacheXMLHttpRequest = Record<`_${keyof XMLHttpRequest}`, string>;
export type ProxyXHR = {
    method: "GET" | "HEAD" | "POST";
    url: string;
    async: boolean;
    user: string;
    password: string;
    body: string;
    headers: Record<string, string>;
    withCredentials: boolean;
} & CacheXMLHttpRequest & XMLHttpRequest;
type ProxyXHREventFunc = (xhr: ProxyXHR, ev: ProgressEvent, receiver: ProxyXHR) => boolean | undefined;
type ProxyXHRFunc = (xhr: ProxyXHR, args: any[], receiver: ProxyXHR) => boolean | undefined;
interface SetGetFn<T = any> {
    getter?: (xhr: ProxyXHR, value: T, receiver: ProxyXHR) => T | boolean;
    setter?: (xhr: ProxyXHR, value: T, receiver: ProxyXHR) => T | boolean;
}
export type ProxyOptions = {
    onreadystatechange?: ProxyXHREventFunc;
    onabort?: ProxyXHREventFunc;
    onerror?: ProxyXHREventFunc;
    onload?: ProxyXHREventFunc;
    onloadend?: ProxyXHREventFunc;
    onloadstart?: ProxyXHREventFunc;
    onprogress?: ProxyXHREventFunc;
    ontimeout?: ProxyXHREventFunc;
    abort?: ProxyXHRFunc;
    getAllResponseHeaders?: ProxyXHRFunc;
    getResponseHeader?: ProxyXHRFunc;
    open?: ProxyXHRFunc;
    overrideMimeType?: ProxyXHRFunc;
    send?: ProxyXHRFunc;
    setRequestHeader?: ProxyXHRFunc;
    addEventListener?: ProxyXHRFunc;
    removeEventListener?: ProxyXHRFunc;
    dispatchEvent?: ProxyXHRFunc;
    response?: SetGetFn;
    responseText?: SetGetFn<string>;
    readyState?: SetGetFn<number>;
    responseType?: SetGetFn<XMLHttpRequestResponseType>;
    responseURL?: SetGetFn<string>;
    responseXML?: SetGetFn<Document | null>;
    status?: SetGetFn<number>;
    statusText?: SetGetFn<string>;
    timeout?: SetGetFn<number>;
    upload?: SetGetFn<XMLHttpRequestUpload>;
    withCredentials?: SetGetFn<boolean>;
    UNSENT?: SetGetFn<number>;
    OPENED?: SetGetFn<number>;
    HEADERS_RECEIVED?: SetGetFn<number>;
    LOADING?: SetGetFn<number>;
    DONE?: SetGetFn<number>;
};
export type ProxyWin = Window & typeof globalThis & {
    ["_xhr"]?: typeof XMLHttpRequest;
};
export {};

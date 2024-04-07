type Resource =
  | string
  | {
      [key: string]: Resource;
    };
type NamespaceResource = {
  [lang: string]: Resource;
};
export type ResourceBundle = {
  [ns: string]: NamespaceResource;
};

export interface LocaleInstance {
  register: (resource: ResourceBundle) => void;
}

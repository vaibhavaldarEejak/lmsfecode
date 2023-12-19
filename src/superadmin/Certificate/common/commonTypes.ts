export interface IconProps {
  size: number;
}
export interface NotificationEventListRequestType {
  notificationCategoryId: number;
}

export interface NotificationCategoryListResponseType extends NotificationEventListRequestType {
  notificationCategoryName: string;
}

export interface CategoryListType extends NotificationCategoryListResponseType {
  id: number;
  value: number;
}

export interface InitialNotificationState {
  notificationList: NotificationListResponseType[];
  notificationData: NotificationResponseType;
  updateNotificationData: AddNewNotificationRequestType;
}

export interface NotificationEventListResponseType {
  notificationEventId: number;
  notificationEventName: string;
}
export interface DynamicFieldRequestType {
  notificationEventId: number;
}

export interface NotificationListResponseType {
  notificationId: number;
  notificationName: string;
  notificationCategoryName: string;
  notificationEventName: string;
  isActive: number;
}

export interface DynamicFieldResponseType {
  dynamicFieldsId: number;
  dynamicFieldsName: string;
  dynamicFieldsTag: string;
}

export interface AddNewNotificationRequestType {
  notificationName: string;
  notificationCategory: number | null;
  notificationEvent: number | null;
  // trackedUserGroup: number;
  // groups: number[];
  // users: string[];
  // recipient: number;
  // training: string;
  // defineDays: string;
  notificationSubject: string;
  notificationContent: string;
}

export interface UpdateNotificationRequestType {
  notificationId: number | null;
  notificationName: string;
  notificationCategory: number | null;
  notificationEvent: number | null;
  // trackedUserGroup: number;
  // groups: number[];
  // users: string[];
  // recipient: number;
  // training: string;
  // defineDays: string;
  notificationSubject: string;
  notificationContent: string;
}

export interface NotificationResponseType {
  notificationId: number | null;
  notificationName: string;
  notificationCategoryId: number | null;
  notificationCategoryName: string;
  notificationEventId: number | null;
  notificationEventName: string;
  trainingId: number | null;
  notificationSubject: string;
  notificationContent: string;
  isActive: number | null;
}

export interface DynamicFieldResponseType {
  id: number;
  value: string;
  dynamicFieldsId: number;
  dynamicFieldsName: string;
  dynamicFieldsTag: string;
}

export interface DeleteNotificationRequestType {
  notificationId: number;
}

export interface DeleteNotificationResponseType {
  status: string;
  code: number;
  message: string;
}
export interface SetUpdateNotificationDataType {
  key: string;
  value: number | string;
}
export interface NotificationEventListOptionType extends NotificationEventListResponseType {
  value: number;
  label: string;
}
export interface NotificationCategoryListOptionType extends NotificationCategoryListResponseType {
  value: number;
  label: string;
}

export interface EventDetailFormInitialStateType {
  notificationName: string;
  notificationCategory: NotificationCategoryListOptionType | null;
  notificationEvent: NotificationEventListOptionType | null;
  notificationSubject: string;
}

export interface EventDetailFormProps {
  notificationName: string;
  notificationCategoryId?: number | null;
  notificationEventId?: number | null;
  notificationSubject: string;
  eventList: NotificationEventListOptionType[];
  categoryList: NotificationCategoryListOptionType[];
  getEventList: (notificationCategoryId: number) => void;
  getDynamicFieldList: (notificationEventId: number) => void;
  eventListFetching: boolean;
}

export interface SingleSelectProps {
  options: NotificationCategoryListOptionType[] | NotificationEventListOptionType[];
  id: string;
  placeholder: string;
  value: NotificationCategoryListOptionType | NotificationEventListOptionType | null;
  onSelectChange: (value: NotificationCategoryListOptionType | NotificationEventListOptionType | null) => void;
}

export interface DropdownListItemProps {
  options: NotificationCategoryListOptionType[] | NotificationEventListOptionType[];
  id: string;
  placeholder: string;
  value: NotificationCategoryListOptionType | NotificationEventListOptionType | null;
  onSelectChange: (value: NotificationCategoryListOptionType | NotificationEventListOptionType | null) => void;
}
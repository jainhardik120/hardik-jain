// This file is auto-generated by @hey-api/openapi-ts

import { client, type Options } from '@hey-api/client-fetch';
import type {
  GetAppJwksData,
  GetAppJwksError,
  GetAppJwksResponse2,
  DeleteAssetData,
  DeleteAssetError,
  DeleteAssetResponse,
  GetAssetData,
  GetAssetError,
  GetAssetResponse2,
  UpdateAssetData,
  UpdateAssetError,
  UpdateAssetResponse2,
  CreateAssetUploadJobData,
  CreateAssetUploadJobError,
  CreateAssetUploadJobResponse2,
  GetAssetUploadJobData,
  GetAssetUploadJobError,
  GetAssetUploadJobResponse2,
  CreateDesignAutofillJobData,
  CreateDesignAutofillJobError,
  CreateDesignAutofillJobResponse2,
  GetDesignAutofillJobData,
  GetDesignAutofillJobError,
  GetDesignAutofillJobResponse2,
  ListBrandTemplatesData,
  ListBrandTemplatesError,
  ListBrandTemplatesResponse2,
  GetBrandTemplateData,
  GetBrandTemplateError,
  GetBrandTemplateResponse2,
  GetBrandTemplateDatasetData,
  GetBrandTemplateDatasetError,
  GetBrandTemplateDatasetResponse2,
  CreateCommentData,
  CreateCommentError,
  CreateCommentResponse2,
  CreateReplyData,
  CreateReplyError,
  CreateReplyResponse2,
  GetCommentData,
  GetCommentError,
  GetCommentResponse2,
  GetSigningPublicKeysError,
  GetSigningPublicKeysResponse2,
  ListDesignsData,
  ListDesignsError,
  ListDesignsResponse,
  CreateDesignData,
  CreateDesignError,
  CreateDesignResponse2,
  GetDesignData,
  GetDesignError,
  GetDesignResponse2,
  GetDesignPagesData,
  GetDesignPagesError,
  GetDesignPagesResponse2,
  CreateDesignImportJobData,
  CreateDesignImportJobError,
  CreateDesignImportJobResponse2,
  GetDesignImportJobData,
  GetDesignImportJobError,
  GetDesignImportJobResponse2,
  CreateDesignExportJobData,
  CreateDesignExportJobError,
  CreateDesignExportJobResponse2,
  GetDesignExportJobData,
  GetDesignExportJobError,
  GetDesignExportJobResponse2,
  DeleteFolderData,
  DeleteFolderError,
  DeleteFolderResponse,
  GetFolderData,
  GetFolderError,
  GetFolderResponse2,
  UpdateFolderData,
  UpdateFolderError,
  UpdateFolderResponse2,
  ListFolderItemsData,
  ListFolderItemsError,
  ListFolderItemsResponse2,
  MoveFolderItemData,
  MoveFolderItemError,
  MoveFolderItemResponse,
  CreateFolderData,
  CreateFolderError,
  CreateFolderResponse2,
  ExchangeAccessTokenData,
  ExchangeAccessTokenError,
  ExchangeAccessTokenResponse2,
  IntrospectTokenData,
  IntrospectTokenError,
  IntrospectTokenResponse2,
  RevokeTokensData,
  RevokeTokensError,
  RevokeTokensResponse2,
  UsersMeError,
  UsersMeResponse2,
  GetUserProfileError,
  GetUserProfileResponse,
} from './types.gen';

export class AppService {
  /**
   * Returns the Json Web Key Set (public keys) of an app. These keys are used to
   * verify JWTs sent to app backends.
   */
  public static getAppJwks(options: Options<GetAppJwksData>) {
    return (options?.client ?? client).get<GetAppJwksResponse2, GetAppJwksError>({
      ...options,
      url: '/v1/apps/{appId}/jwks',
    });
  }
}

export class AssetService {
  /**
   * You can delete an asset by specifying its `assetId`. This operation mirrors the behavior
   * in the Canva UI. Deleting an item moves it to the trash.
   * Deleting an asset doesn't remove it from designs that already use it.
   */
  public static deleteAsset(options: Options<DeleteAssetData>) {
    return (options?.client ?? client).delete<DeleteAssetResponse, DeleteAssetError>({
      ...options,
      url: '/v1/assets/{assetId}',
    });
  }

  /**
   * You can retrieve the metadata of an asset by specifying its `assetId`.
   */
  public static getAsset(options: Options<GetAssetData>) {
    return (options?.client ?? client).get<GetAssetResponse2, GetAssetError>({
      ...options,
      url: '/v1/assets/{assetId}',
    });
  }

  /**
   * You can update the name and tags of an asset by specifying its `assetId`. Updating the tags
   * replaces all existing tags of the asset.
   */
  public static updateAsset(options: Options<UpdateAssetData>) {
    return (options?.client ?? client).patch<UpdateAssetResponse2, UpdateAssetError>({
      ...options,
      url: '/v1/assets/{assetId}',
    });
  }

  /**
   * Starts a new job to upload an asset to a user's content library.
   *
   * The request format for this endpoint is an `application/octet-stream` body of bytes. Attach
   * information about the upload using an `Asset-Upload-Metadata` header.
   *
   * You can check the status and get the results of asset upload jobs created with this API using the [Get asset upload job API](https://www.canva.dev/docs/connect/api-reference/assets/get-asset-upload-job/).
   */
  public static createAssetUploadJob(options: Options<CreateAssetUploadJobData>) {
    return (options?.client ?? client).post<
      CreateAssetUploadJobResponse2,
      CreateAssetUploadJobError
    >({
      ...options,
      url: '/v1/asset-uploads',
    });
  }

  /**
   * Get the result of an asset upload job that was created using the [Create asset upload job API](https://www.canva.dev/docs/connect/api-reference/assets/create-asset-upload-job/).
   *
   * You might need to make multiple requests to this endpoint until you get a `success` or `failed` status.
   */
  public static getAssetUploadJob(options: Options<GetAssetUploadJobData>) {
    return (options?.client ?? client).get<GetAssetUploadJobResponse2, GetAssetUploadJobError>({
      ...options,
      url: '/v1/asset-uploads/{jobId}',
    });
  }
}

export class AutofillService {
  /**
   * <Warning>
   *
   * Later this year, we'll be updating all brand template IDs. If your integration stores brand template IDs, you'll need to migrate to the new IDs. Once we implement this change, you'll have 6 months to update the IDs.
   *
   * </Warning>
   *
   * <Note>
   *
   * To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
   *
   * </Note>
   *
   * Starts a new job to autofill a Canva design using a brand template and input data.
   *
   * To get a list of input data fields, use the [Get brand template dataset
   * API](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template-dataset/).
   *
   * Available data field types to autofill include:
   *
   * - Images
   * - Text
   * - Charts
   *
   * WARNING: Chart data fields are a [preview feature](https://www.canva.dev/docs/connect/#preview-apis). There might be unannounced breaking changes to this feature which won't produce a new API version.
   *
   * You can check the status and get the results of autofill jobs created with this API using the [Get design autofill job API](https://www.canva.dev/docs/connect/api-reference/autofills/get-design-autofill-job/).
   */
  public static createDesignAutofillJob(options?: Options<CreateDesignAutofillJobData>) {
    return (options?.client ?? client).post<
      CreateDesignAutofillJobResponse2,
      CreateDesignAutofillJobError
    >({
      ...options,
      url: '/v1/autofills',
    });
  }

  /**
   * <Note>
   *
   * To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
   *
   * </Note>
   *
   * Get the result of a design autofill job that was created using the [Create a design autofill job
   * API](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job/).
   *
   * You might need to make multiple requests to this endpoint until you get a `success` or
   * `failed` status.
   */
  public static getDesignAutofillJob(options: Options<GetDesignAutofillJobData>) {
    return (options?.client ?? client).get<
      GetDesignAutofillJobResponse2,
      GetDesignAutofillJobError
    >({
      ...options,
      url: '/v1/autofills/{jobId}',
    });
  }
}

export class BrandTemplateService {
  /**
   * <Warning>
   *
   * Later this year, we'll be updating all brand template IDs. If your integration stores brand template IDs, you'll need to migrate to the new IDs. Once we implement this change, you'll have 6 months to update the IDs.
   *
   * </Warning>
   *
   * <Note>
   *
   * To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
   *
   * </Note>
   *
   * Get a list of the [brand templates](https://www.canva.com/help/publish-team-template/) the user has access to.
   */
  public static listBrandTemplates(options?: Options<ListBrandTemplatesData>) {
    return (options?.client ?? client).get<ListBrandTemplatesResponse2, ListBrandTemplatesError>({
      ...options,
      url: '/v1/brand-templates',
    });
  }

  /**
   * <Warning>
   *
   * Later this year, we'll be updating all brand template IDs. If your integration stores brand template IDs, you'll need to migrate to the new IDs. Once we implement this change, you'll have 6 months to update the IDs.
   *
   * </Warning>
   *
   * <Note>
   *
   * To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
   *
   * </Note>
   *
   * Retrieves the metadata for a brand template.
   */
  public static getBrandTemplate(options: Options<GetBrandTemplateData>) {
    return (options?.client ?? client).get<GetBrandTemplateResponse2, GetBrandTemplateError>({
      ...options,
      url: '/v1/brand-templates/{brandTemplateId}',
    });
  }

  /**
   * <Warning>
   *
   * Later this year, we'll be updating all brand template IDs. If your integration stores brand template IDs, you'll need to migrate to the new IDs. Once we implement this change, you'll have 6 months to update the IDs.
   *
   * </Warning>
   *
   * <Note>
   *
   * To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
   *
   * </Note>
   *
   * Gets the dataset definition of a brand template. If the brand
   * template contains autofill data fields, this API returns an object with the data field
   * names and the type of data they accept.
   *
   * Available data field types include:
   *
   * - Images
   * - Text
   * - Charts
   *
   * You can autofill a brand template using the [Create a design autofill job
   * API](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job/).
   *
   * WARNING: Chart data fields are a [preview feature](https://www.canva.dev/docs/connect/#preview-apis). There might be unannounced breaking changes to this feature which won't produce a new API version.
   */
  public static getBrandTemplateDataset(options: Options<GetBrandTemplateDatasetData>) {
    return (options?.client ?? client).get<
      GetBrandTemplateDatasetResponse2,
      GetBrandTemplateDatasetError
    >({
      ...options,
      url: '/v1/brand-templates/{brandTemplateId}/dataset',
    });
  }
}

export class CommentService {
  /**
   * <Warning>
   *
   * This API is currently provided as a preview. Be aware of the following:
   *
   * - There might be unannounced breaking changes.
   * - Any breaking changes to preview APIs won't produce a new [API version](https://www.canva.dev/docs/connect/versions/).
   * - Public integrations that use preview APIs will not pass the review process, and can't be made available to all Canva users.
   *
   * </Warning>
   *
   * Create a new top-level comment on a design.
   * For information on comments and how they're used in the Canva UI, see the
   * [Canva Help Center](https://www.canva.com/help/comments/). A design can have a maximum
   * of 1000 comments.
   */
  public static createComment(options: Options<CreateCommentData>) {
    return (options?.client ?? client).post<CreateCommentResponse2, CreateCommentError>({
      ...options,
      url: '/v1/comments',
    });
  }

  /**
   * <Warning>
   *
   * This API is currently provided as a preview. Be aware of the following:
   *
   * - There might be unannounced breaking changes.
   * - Any breaking changes to preview APIs won't produce a new [API version](https://www.canva.dev/docs/connect/versions/).
   * - Public integrations that use preview APIs will not pass the review process, and can't be made available to all Canva users.
   *
   * </Warning>
   *
   * Creates a reply to a comment in a design.
   * To reply to an existing thread of comments, you can use either the `id` of the parent
   * (original) comment, or the `thread_id` of a comment in the thread. Each comment can
   * have a maximum of 100 replies created for it.
   *
   * For information on comments and how they're used in the Canva UI, see the
   * [Canva Help Center](https://www.canva.com/help/comments/).
   */
  public static createReply(options: Options<CreateReplyData>) {
    return (options?.client ?? client).post<CreateReplyResponse2, CreateReplyError>({
      ...options,
      url: '/v1/comments/{commentId}/replies',
    });
  }

  /**
   * <Warning>
   *
   * This API is currently provided as a preview. Be aware of the following:
   *
   * - There might be unannounced breaking changes.
   * - Any breaking changes to preview APIs won't produce a new [API version](https://www.canva.dev/docs/connect/versions/).
   * - Public integrations that use preview APIs will not pass the review process, and can't be made available to all Canva users.
   *
   * </Warning>
   *
   * Gets a comment.
   * For information on comments and how they're used in the Canva UI, see the
   * [Canva Help Center](https://www.canva.com/help/comments/).
   */
  public static getComment(options: Options<GetCommentData>) {
    return (options?.client ?? client).get<GetCommentResponse2, GetCommentError>({
      ...options,
      url: '/v1/designs/{designId}/comments/{commentId}',
    });
  }
}

export class ConnectService {
  /**
   * <Warning>
   *
   * This API is currently provided as a preview. Be aware of the following:
   *
   * - There might be unannounced breaking changes.
   * - Any breaking changes to preview APIs won't produce a new [API version](https://www.canva.dev/docs/connect/versions/).
   * - Public integrations that use preview APIs will not pass the review process, and can't be made available to all Canva users.
   *
   * </Warning>
   *
   * The Keys API (`connect/keys`) is a security measure you can use to verify the authenticity
   * of webhooks you receive from Canva Connect. The Keys API returns a
   * [JSON Web Key (JWK)](https://www.rfc-editor.org/rfc/rfc7517#section-2), which you can use to
   * decrypt the webhook signature and verify it came from Canva and not a potentially malicious
   * actor. This helps to protect your systems from
   * [Replay attacks](https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/).
   *
   * The keys returned by the Keys API can rotate. We recommend you cache the keys you receive
   * from this API where possible, and only access this API when you receive a webhook signed
   * with an unrecognized key. This allows you to verify webhooks quicker than accessing this API
   * every time you receive a webhook.
   */
  public static getSigningPublicKeys(options?: Options) {
    return (options?.client ?? client).get<
      GetSigningPublicKeysResponse2,
      GetSigningPublicKeysError
    >({
      ...options,
      url: '/v1/connect/keys',
    });
  }
}

export class DesignService {
  /**
   * Lists metadata for all the designs in a Canva user's
   * [projects](https://www.canva.com/help/find-designs-and-folders/). You can also:
   *
   * - Use search terms to filter the listed designs.
   * - Show designs either created by, or shared with the user.
   * - Sort the results.
   */
  public static listDesigns(options?: Options<ListDesignsData>) {
    return (options?.client ?? client).get<ListDesignsResponse, ListDesignsError>({
      ...options,
      url: '/v1/designs',
    });
  }

  /**
   * Creates a new Canva design. To create a new design, you can either:
   *
   * - Use a preset design type.
   * - Set height and width dimensions for a custom design.
   *
   * Additionally, you can also provide the `asset_id` of an asset in the user's [projects](https://www.canva.com/help/find-designs-and-folders/) to add to the new design. To list the assets in a folder in the user's projects, use the [List folder items API](https://www.canva.dev/docs/connect/api-reference/folders/list-folder-items/).
   */
  public static createDesign(options?: Options<CreateDesignData>) {
    return (options?.client ?? client).post<CreateDesignResponse2, CreateDesignError>({
      ...options,
      url: '/v1/designs',
    });
  }

  /**
   * Gets the metadata for a design. This includes owner information, URLs for editing and viewing, and thumbnail information.
   */
  public static getDesign(options: Options<GetDesignData>) {
    return (options?.client ?? client).get<GetDesignResponse2, GetDesignError>({
      ...options,
      url: '/v1/designs/{designId}',
    });
  }

  /**
   * <Warning>
   *
   * This API is currently provided as a preview. Be aware of the following:
   *
   * - There might be unannounced breaking changes.
   * - Any breaking changes to preview APIs won't produce a new [API version](https://www.canva.dev/docs/connect/versions/).
   * - Public integrations that use preview APIs will not pass the review process, and can't be made available to all Canva users.
   *
   * </Warning>
   *
   * Lists metadata for pages in a design, such as page-specific thumbnails.
   *
   * For the specified design, you can provide `offset` and `limit` values to specify the range of pages to return.
   *
   * NOTE: Some design types don't have pages (for example, Canva docs).
   */
  public static getDesignPages(options: Options<GetDesignPagesData>) {
    return (options?.client ?? client).get<GetDesignPagesResponse2, GetDesignPagesError>({
      ...options,
      url: '/v1/designs/{designId}/pages',
    });
  }
}

export class DesignImportService {
  /**
   * Starts a new job to import an external file as a new design in Canva.
   *
   * You can check the status and get the results of import jobs created with this API using the [Get design import job API](https://www.canva.dev/docs/connect/api-reference/design-imports/get-design-import-job/).
   *
   * The request format for this endpoint has an `application/octet-stream` body of bytes,
   * and the information about the import is attached using an `Import-Metadata` header.
   *
   * Supported file types:
   *
   * | Name                              | MIME type                                                                 | File extension |
   * | --------------------------------- | ------------------------------------------------------------------------- | -------------- |
   * | Adobe Illustrator                 | application/illustrator                                                   | .ai            |
   * | Adobe Photoshop                   | image/vnd.adobe.photoshop                                                 | .psd           |
   * | Apple Keynote                     | application/vnd.apple.keynote                                             | .key           |
   * | Apple Numbers                     | application/vnd.apple.numbers                                             | .numbers       |
   * | Apple Pages                       | application/vnd.apple.pages                                               | .pages         |
   * | Microsoft Excel (pre 2007)        | application/vnd.ms-excel                                                  | .xls           |
   * | Microsoft Excel                   | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet         | .xlsx          |
   * | Microsoft PowerPoint (pre 2007)   | application/vnd.ms-powerpoint                                             | .ppt           |
   * | Microsoft PowerPoint              | application/vnd.openxmlformats-officedocument.presentationml.presentation | .pptx          |
   * | Microsoft Word (pre 2007)         | application/msword                                                        | .doc           |
   * | Microsoft Word                    | application/vnd.openxmlformats-officedocument.wordprocessingml.document   | .docx          |
   * | OpenOffice Draw                   | application/vnd.oasis.opendocument.graphics                               | .odg           |
   * | OpenOffice Presentation           | application/vnd.oasis.opendocument.presentation                           | .odp           |
   * | OpenOffice Sheets                 | application/vnd.oasis.opendocument.spreadsheet                            | .ods           |
   * | OpenOffice Text                   | application/vnd.oasis.opendocument.text                                   | .odt           |
   * | PDF                               | application/pdf                                                           | .pdf           |
   *
   * For upload formats and requirements, see
   * [Canva Help — Upload formats and requirements](https://www.canva.com/help/upload-formats-requirements/).
   */
  public static createDesignImportJob(options: Options<CreateDesignImportJobData>) {
    return (options?.client ?? client).post<
      CreateDesignImportJobResponse2,
      CreateDesignImportJobError
    >({
      ...options,
      url: '/v1/imports',
    });
  }

  /**
   * Gets the status and results of design import jobs created using the [Create design import job API](https://www.canva.dev/docs/connect/api-reference/design-imports/create-design-import-job/).
   */
  public static getDesignImportJob(options: Options<GetDesignImportJobData>) {
    return (options?.client ?? client).get<GetDesignImportJobResponse2, GetDesignImportJobError>({
      ...options,
      url: '/v1/imports/{jobId}',
    });
  }
}

export class ExportService {
  /**
   * Starts a new job to export a file from Canva. Once the exported file is generated, you can download
   * it using the link(s) provided.
   *
   * The request requires the design ID and the exported file format type.
   *
   * Supported file formats (and export file type values): PDF (`pdf`), JPG (`jpg`), PNG (`png`), GIF (`gif`), Microsoft PowerPoint (`pptx`), and MP4 (`mp4`).
   *
   * You can check the status and get the results of export jobs created with this API using the [Get design export job API](https://www.canva.dev/docs/connect/api-reference/exports/get-design-export-job/).
   *
   * NOTE: If you set `export_quality` to `pro`, the export might fail if the design contains [premium elements](https://www.canva.com/help/premium-elements/), and the calling user either hasn't purchased the elements or isn't on a Canva plan (such as Canva Pro) that has premium features.
   */
  public static createDesignExportJob(options?: Options<CreateDesignExportJobData>) {
    return (options?.client ?? client).post<
      CreateDesignExportJobResponse2,
      CreateDesignExportJobError
    >({
      ...options,
      url: '/v1/exports',
    });
  }

  /**
   * Gets the result of a design export job that was created using the [Create design export job API](https://www.canva.dev/docs/connect/api-reference/exports/create-design-export-job/).
   *
   * If the job is complete, the response includes an array
   * of download links for each page of the design.
   */
  public static getDesignExportJob(options: Options<GetDesignExportJobData>) {
    return (options?.client ?? client).get<GetDesignExportJobResponse2, GetDesignExportJobError>({
      ...options,
      url: '/v1/exports/{exportId}',
    });
  }
}

export class FolderService {
  /**
   * Deletes a folder with the specified `folderID`.
   * Deleting a folder moves the user's content in the folder to the
   * [Trash](https://www.canva.com/help/deleted-designs/) and content owned by
   * other users is moved to the top level of the owner's
   * [projects](https://www.canva.com/help/find-designs-and-folders/).
   */
  public static deleteFolder(options: Options<DeleteFolderData>) {
    return (options?.client ?? client).delete<DeleteFolderResponse, DeleteFolderError>({
      ...options,
      url: '/v1/folders/{folderId}',
    });
  }

  /**
   * Gets the name and other details of a folder using a folder's `folderID`.
   */
  public static getFolder(options: Options<GetFolderData>) {
    return (options?.client ?? client).get<GetFolderResponse2, GetFolderError>({
      ...options,
      url: '/v1/folders/{folderId}',
    });
  }

  /**
   * Updates a folder's details using its `folderID`.
   * Currently, you can only update a folder's name.
   */
  public static updateFolder(options: Options<UpdateFolderData>) {
    return (options?.client ?? client).patch<UpdateFolderResponse2, UpdateFolderError>({
      ...options,
      url: '/v1/folders/{folderId}',
    });
  }

  /**
   * Lists the items in a folder, including each item's `type`.
   *
   * Folders can contain:
   *
   * - Other folders.
   * - Designs, such as Instagram posts, Presentations, and Documents ([Canva Docs](https://www.canva.com/create/documents/)).
   * - Image assets.
   */
  public static listFolderItems(options: Options<ListFolderItemsData>) {
    return (options?.client ?? client).get<ListFolderItemsResponse2, ListFolderItemsError>({
      ...options,
      url: '/v1/folders/{folderId}/items',
    });
  }

  /**
   * Moves an item to another folder. You must specify the folder ID of the destination folder, as well as the ID of the item you want to move.
   *
   * NOTE: In some situations, a single item can exist in multiple folders. If you attempt to move an item that exists in multiple folders, the API returns an `item_in_multiple_folders` error. In this case, you must use the Canva UI to move the item to another folder.
   */
  public static moveFolderItem(options?: Options<MoveFolderItemData>) {
    return (options?.client ?? client).post<MoveFolderItemResponse, MoveFolderItemError>({
      ...options,
      url: '/v1/folders/move',
    });
  }

  /**
   * Creates a folder in either the top level of a Canva user's
   * [projects](https://www.canva.com/help/find-designs-and-folders/) (using the ID `root`), or
   * another folder (using the parent folder's ID). When a folder is successfully created, the
   * endpoint returns its folder ID, along with other information.
   */
  public static createFolder(options: Options<CreateFolderData>) {
    return (options?.client ?? client).post<CreateFolderResponse2, CreateFolderError>({
      ...options,
      url: '/v1/folders',
    });
  }
}

export class OauthService {
  /**
   * This endpoint implements the OAuth 2.0 `token` endpoint, as part of the Authorization Code flow with Proof Key for Code Exchange (PKCE). For more information, see [Authentication](https://www.canva.dev/docs/connect/authentication/).
   *
   * To generate an access token, you must provide one of the following:
   *
   * - An authorization code
   * - A refresh token
   *
   * Generating a token using either an authorization code or a refresh token allows your integration to act on behalf of a user. You must first [obtain user authorization and get an authorization code](https://www.canva.dev/docs/connect/authentication/#obtain-user-authorization).
   *
   * Access tokens may be up to 4 KB in size, and are only valid for a specified period of time. The expiry time (currently 4 hours) is shown in the endpoint response and is subject to change.
   *
   * **Endpoint authentication**
   *
   * Requests to this endpoint require authentication with your client ID and client secret, using _one_ of the following methods:
   *
   * - **Basic access authentication** (Recommended): For [basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication), the `{credentials}` string must be a Base64 encoded value of `{client id}:{client secret}`.
   * - **Body parameters**: Provide your integration's credentials using the `client_id` and `client_secret` body parameters.
   *
   * **Generate an access token using an authorization code**
   *
   * To generate an access token with an authorization code, you must:
   *
   * - Set `grant_type` to `authorization_code`.
   * - Provide the `code_verifier` value that you generated when creating the user authorization URL.
   * - Provide the authorization code you received after the user authorized the integration.
   *
   * **Generate an access token using a refresh token**
   *
   * Using the `refresh_token` value from a previous user token request, you can get a new access token with the same or smaller scope as the previous one, but with a refreshed expiry time. You will also receive a new refresh token that you can use to refresh the access token again.
   *
   * To refresh an existing access token, you must:
   *
   * - Set `grant_type` to `refresh_token`.
   * - Provide the `refresh_token` from a previous token request.
   */
  public static exchangeAccessToken(options: Options<ExchangeAccessTokenData>) {
    return (options?.client ?? client).post<ExchangeAccessTokenResponse2, ExchangeAccessTokenError>(
      {
        ...options,
        url: '/v1/oauth/token',
      },
    );
  }

  /**
   * Introspect an access token to see whether it is valid and active. You can also verify some token properties, such as its claims, scopes, and validity times.
   *
   * Requests to this endpoint require authentication with your client ID and client secret, using _one_ of the following methods:
   *
   * - **Basic access authentication** (Recommended): For [basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication), the `{credentials}` string must be a Base64 encoded value of `{client id}:{client secret}`.
   * - **Body parameters**: Provide your integration's credentials using the `client_id` and `client_secret` body parameters.
   */
  public static introspectToken(options: Options<IntrospectTokenData>) {
    return (options?.client ?? client).post<IntrospectTokenResponse2, IntrospectTokenError>({
      ...options,
      url: '/v1/oauth/introspect',
    });
  }

  /**
   * Revoke an access token or a refresh token.
   *
   * If you revoke a _refresh token_, be aware that:
   *
   * - The refresh token's lineage is also revoked. This means that access tokens created from that refresh token are also revoked.
   * - The user's consent for your integration is also revoked. This means that the user must go through the OAuth process again to use your integration.
   *
   * Requests to this endpoint require authentication with your client ID and client secret, using _one_ of the following methods:
   *
   * - **Basic access authentication** (Recommended): For [basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication), the `{credentials}` string must be a Base64 encoded value of `{client id}:{client secret}`.
   * - **Body parameters**: Provide your integration's credentials using the `client_id` and `client_secret` body parameters.
   */
  public static revokeTokens(options: Options<RevokeTokensData>) {
    return (options?.client ?? client).post<RevokeTokensResponse2, RevokeTokensError>({
      ...options,
      url: '/v1/oauth/revoke',
    });
  }
}

export class UserService {
  /**
   * Returns the User ID, Team ID, and display name of the user
   * account associated with the provided access token.
   */
  public static usersMe(options?: Options) {
    return (options?.client ?? client).get<UsersMeResponse2, UsersMeError>({
      ...options,
      url: '/v1/users/me',
    });
  }

  /**
   * Currently, this returns the display name of the user account associated with the provided access token. More user information is expected to be included in the future.
   */
  public static getUserProfile(options?: Options) {
    return (options?.client ?? client).get<GetUserProfileResponse, GetUserProfileError>({
      ...options,
      url: '/v1/users/me/profile',
    });
  }
}

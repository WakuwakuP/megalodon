import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import objectAssignDeep from 'object-assign-deep'

import Response from '../response'
import { RequestCanceledError } from '../cancel'
import { NO_REDIRECT, DEFAULT_SCOPE, DEFAULT_UA } from '../default'
import PixelfedEntity from './entity'
import MegalodonEntity from '../entity'
import NotificationType, { UnknownNotificationTypeError } from '../notification'
import PixelfedNotificationType from './notification'
import Streaming from './web_socket'

namespace PixelfedAPI {
  /**
   * Interface
   */
  export interface Interface {
    get<T = any>(path: string, params?: any, headers?: { [key: string]: string }, pathIsFullyQualified?: boolean): Promise<Response<T>>
    put<T = any>(path: string, params?: any, headers?: { [key: string]: string }): Promise<Response<T>>
    putForm<T = any>(path: string, params?: any, headers?: { [key: string]: string }): Promise<Response<T>>
    patch<T = any>(path: string, params?: any, headers?: { [key: string]: string }): Promise<Response<T>>
    patchForm<T = any>(path: string, params?: any, headers?: { [key: string]: string }): Promise<Response<T>>
    post<T = any>(path: string, params?: any, headers?: { [key: string]: string }): Promise<Response<T>>
    postForm<T = any>(path: string, params?: any, headers?: { [key: string]: string }): Promise<Response<T>>
    del<T = any>(path: string, params?: any, headers?: { [key: string]: string }): Promise<Response<T>>
    cancel(): void
    socket(): Streaming
  }

  /**
   * Pixelfed API client.
   *
   * Using axios for request, you will handle promises.
   */
  export class Client implements Interface {
    static DEFAULT_SCOPE = DEFAULT_SCOPE
    static DEFAULT_URL = 'https://pixelfed.social'
    static NO_REDIRECT = NO_REDIRECT

    private accessToken: string | null
    private baseUrl: string
    private abortController: AbortController

    /**
     * @param baseUrl hostname or base URL
     * @param accessToken access token from OAuth2 authorization
     * @param userAgent UserAgent is specified in header on request.
     */
    constructor(baseUrl: string, accessToken: string | null = null, _userAgent: string = DEFAULT_UA) {
      this.accessToken = accessToken
      this.baseUrl = baseUrl
      this.abortController = new AbortController()
      axios.defaults.signal = this.abortController.signal
    }

    /**
     * GET request to pixelfed REST API.
     * @param path relative path from baseUrl
     * @param params Query parameters
     * @param headers Request header object
     */
    public async get<T>(
      path: string,
      params = {},
      headers: { [key: string]: string } = {},
      pathIsFullyQualified = false
    ): Promise<Response<T>> {
      let options: AxiosRequestConfig = {
        params: params,
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      if (this.accessToken) {
        options = objectAssignDeep({}, options, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      }
      return axios
        .get<T>((pathIsFullyQualified ? '' : this.baseUrl) + path, options)
        .catch((err: Error) => {
          if (axios.isCancel(err)) {
            throw new RequestCanceledError(err.message)
          } else {
            throw err
          }
        })
        .then((resp: AxiosResponse<T>) => {
          const res: Response<T> = {
            data: resp.data,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          }
          return res
        })
    }

    /**
     * PUT request to pixelfed REST API.
     * @param path relative path from baseUrl
     * @param params Form data. If you want to post file, please use FormData()
     * @param headers Request header object
     */
    public async put<T>(path: string, params = {}, headers: { [key: string]: string } = {}): Promise<Response<T>> {
      let options: AxiosRequestConfig = {
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      if (this.accessToken) {
        options = objectAssignDeep({}, options, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      }
      return axios
        .put<T>(this.baseUrl + path, params, options)
        .catch((err: Error) => {
          if (axios.isCancel(err)) {
            throw new RequestCanceledError(err.message)
          } else {
            throw err
          }
        })
        .then((resp: AxiosResponse<T>) => {
          const res: Response<T> = {
            data: resp.data,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          }
          return res
        })
    }

    /**
     * PUT request to pixelfed REST API for multipart.
     * @param path relative path from baseUrl
     * @param params Form data. If you want to post file, please use FormData()
     * @param headers Request header object
     */
    public async putForm<T>(path: string, params = {}, headers: { [key: string]: string } = {}): Promise<Response<T>> {
      let options: AxiosRequestConfig = {
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      if (this.accessToken) {
        options = objectAssignDeep({}, options, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      }
      return axios
        .putForm<T>(this.baseUrl + path, params, options)
        .catch((err: Error) => {
          if (axios.isCancel(err)) {
            throw new RequestCanceledError(err.message)
          } else {
            throw err
          }
        })
        .then((resp: AxiosResponse<T>) => {
          const res: Response<T> = {
            data: resp.data,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          }
          return res
        })
    }

    /**
     * PATCH request to pixelfed REST API.
     * @param path relative path from baseUrl
     * @param params Form data. If you want to post file, please use FormData()
     * @param headers Request header object
     */
    public async patch<T>(path: string, params = {}, headers: { [key: string]: string } = {}): Promise<Response<T>> {
      let options: AxiosRequestConfig = {
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      if (this.accessToken) {
        options = objectAssignDeep({}, options, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      }
      return axios
        .patch<T>(this.baseUrl + path, params, options)
        .catch((err: Error) => {
          if (axios.isCancel(err)) {
            throw new RequestCanceledError(err.message)
          } else {
            throw err
          }
        })
        .then((resp: AxiosResponse<T>) => {
          const res: Response<T> = {
            data: resp.data,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          }
          return res
        })
    }

    /**
     * PATCH request to pixelfed REST API for multipart.
     * @param path relative path from baseUrl
     * @param params Form data. If you want to post file, please use FormData()
     * @param headers Request header object
     */
    public async patchForm<T>(path: string, params = {}, headers: { [key: string]: string } = {}): Promise<Response<T>> {
      let options: AxiosRequestConfig = {
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      if (this.accessToken) {
        options = objectAssignDeep({}, options, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      }
      return axios
        .patchForm<T>(this.baseUrl + path, params, options)
        .catch((err: Error) => {
          if (axios.isCancel(err)) {
            throw new RequestCanceledError(err.message)
          } else {
            throw err
          }
        })
        .then((resp: AxiosResponse<T>) => {
          const res: Response<T> = {
            data: resp.data,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          }
          return res
        })
    }

    /**
     * POST request to pixelfed REST API.
     * @param path relative path from baseUrl
     * @param params Form data
     * @param headers Request header object
     */
    public async post<T>(path: string, params = {}, headers: { [key: string]: string } = {}): Promise<Response<T>> {
      let options: AxiosRequestConfig = {
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      if (this.accessToken) {
        options = objectAssignDeep({}, options, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      }
      return axios.post<T>(this.baseUrl + path, params, options).then((resp: AxiosResponse<T>) => {
        const res: Response<T> = {
          data: resp.data,
          status: resp.status,
          statusText: resp.statusText,
          headers: resp.headers
        }
        return res
      })
    }

    /**
     * POST request to pixelfed REST API for multipart.
     * @param path relative path from baseUrl
     * @param params Form data
     * @param headers Request header object
     */
    public async postForm<T>(path: string, params = {}, headers: { [key: string]: string } = {}): Promise<Response<T>> {
      let options: AxiosRequestConfig = {
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      if (this.accessToken) {
        options = objectAssignDeep({}, options, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      }
      return axios.postForm<T>(this.baseUrl + path, params, options).then((resp: AxiosResponse<T>) => {
        const res: Response<T> = {
          data: resp.data,
          status: resp.status,
          statusText: resp.statusText,
          headers: resp.headers
        }
        return res
      })
    }

    /**
     * DELETE request to pixelfed REST API.
     * @param path relative path from baseUrl
     * @param params Form data
     * @param headers Request header object
     */
    public async del<T>(path: string, params = {}, headers: { [key: string]: string } = {}): Promise<Response<T>> {
      let options: AxiosRequestConfig = {
        data: params,
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      if (this.accessToken) {
        options = objectAssignDeep({}, options, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      }
      return axios
        .delete(this.baseUrl + path, options)
        .catch((err: Error) => {
          if (axios.isCancel(err)) {
            throw new RequestCanceledError(err.message)
          } else {
            throw err
          }
        })
        .then((resp: AxiosResponse) => {
          const res: Response<T> = {
            data: resp.data,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          }
          return res
        })
    }

    /**
     * Cancel all requests in this instance.
     * @returns void
     */
    public cancel(): void {
      return this.abortController.abort()
    }

    public socket(): Streaming {
      return new Streaming()
    }
  }

  export namespace Entity {
    export type Account = PixelfedEntity.Account
    export type Announcement = PixelfedEntity.Announcement
    export type Application = PixelfedEntity.Application
    export type AsyncAttachment = MegalodonEntity.AsyncAttachment
    export type Attachment = PixelfedEntity.Attachment
    export type Context = PixelfedEntity.Context
    export type Conversation = PixelfedEntity.Conversation
    export type Emoji = PixelfedEntity.Emoji
    export type Field = PixelfedEntity.Field
    export type Filter = PixelfedEntity.Filter
    export type History = PixelfedEntity.History
    export type Instance = PixelfedEntity.Instance
    export type Marker = PixelfedEntity.Marker
    export type Mention = PixelfedEntity.Mention
    export type Notification = PixelfedEntity.Notification
    export type Poll = PixelfedEntity.Poll
    export type PollOption = PixelfedEntity.PollOption
    export type Preferences = PixelfedEntity.Preferences
    export type Relationship = PixelfedEntity.Relationship
    export type Report = PixelfedEntity.Report
    export type Results = PixelfedEntity.Results
    export type ScheduledStatus = PixelfedEntity.ScheduledStatus
    export type Source = PixelfedEntity.Source
    export type Stats = PixelfedEntity.Stats
    export type Status = PixelfedEntity.Status
    export type StatusParams = PixelfedEntity.StatusParams
    export type Tag = PixelfedEntity.Tag
    export type Token = PixelfedEntity.Token
  }

  export namespace Converter {
    export const encodeNotificationType = (
      t: MegalodonEntity.NotificationType
    ): PixelfedEntity.NotificationType | UnknownNotificationTypeError => {
      switch (t) {
        case NotificationType.Follow:
          return PixelfedNotificationType.Follow
        case NotificationType.Favourite:
          return PixelfedNotificationType.Favourite
        case NotificationType.Reblog:
          return PixelfedNotificationType.Reblog
        case NotificationType.Mention:
          return PixelfedNotificationType.Mention
        case NotificationType.FollowRequest:
          return PixelfedNotificationType.FollowRequest
        default:
          return new UnknownNotificationTypeError()
      }
    }

    export const decodeNotificationType = (
      t: PixelfedEntity.NotificationType
    ): MegalodonEntity.NotificationType | UnknownNotificationTypeError => {
      switch (t) {
        case PixelfedNotificationType.Follow:
          return NotificationType.Follow
        case PixelfedNotificationType.Favourite:
          return NotificationType.Favourite
        case PixelfedNotificationType.Mention:
          return NotificationType.Mention
        case PixelfedNotificationType.Reblog:
          return NotificationType.Reblog
        case PixelfedNotificationType.FollowRequest:
          return NotificationType.FollowRequest
        default:
          return new UnknownNotificationTypeError()
      }
    }

    export const account = (a: Entity.Account): MegalodonEntity.Account => ({
      id: a.id,
      username: a.username,
      acct: a.acct,
      display_name: a.display_name,
      locked: a.locked,
      discoverable: a.discoverable,
      group: null,
      noindex: null,
      suspended: null,
      limited: null,
      created_at: a.created_at,
      followers_count: a.followers_count,
      following_count: a.following_count,
      statuses_count: a.statuses_count,
      note: a.note,
      url: a.url,
      avatar: a.avatar,
      avatar_static: a.avatar_static,
      header: a.header,
      header_static: a.header_static,
      emojis: a.emojis,
      moved: null,
      fields: a.fields,
      bot: null,
      source: a.source
    })
    export const announcement = (a: Entity.Announcement): MegalodonEntity.Announcement => a
    export const application = (a: Entity.Application): MegalodonEntity.Application => a
    export const attachment = (a: Entity.Attachment): MegalodonEntity.Attachment => a
    export const async_attachment = (a: Entity.AsyncAttachment) => {
      if (a.url) {
        return {
          id: a.id,
          type: a.type,
          url: a.url!,
          remote_url: a.remote_url,
          preview_url: a.preview_url,
          text_url: a.text_url,
          meta: a.meta,
          description: a.description,
          blurhash: a.blurhash
        } as MegalodonEntity.Attachment
      } else {
        return a as MegalodonEntity.AsyncAttachment
      }
    }
    export const context = (c: Entity.Context): MegalodonEntity.Context => ({
      ancestors: Array.isArray(c.ancestors) ? c.ancestors.map(a => status(a)) : [],
      descendants: Array.isArray(c.descendants) ? c.descendants.map(d => status(d)) : []
    })
    export const conversation = (c: Entity.Conversation): MegalodonEntity.Conversation => ({
      id: c.id,
      accounts: Array.isArray(c.accounts) ? c.accounts.map(a => account(a)) : [],
      last_status: c.last_status ? status(c.last_status) : null,
      unread: c.unread
    })
    export const emoji = (e: Entity.Emoji): MegalodonEntity.Emoji => e
    export const field = (f: Entity.Field): MegalodonEntity.Field => f
    export const filter = (f: Entity.Filter): MegalodonEntity.Filter => f
    export const history = (h: Entity.History): MegalodonEntity.History => h
    export const instance = (i: Entity.Instance): MegalodonEntity.Instance => ({
      uri: i.uri,
      title: i.title,
      description: i.description,
      email: i.email,
      version: i.version,
      thumbnail: i.thumbnail,
      urls: null,
      stats: stats(i.stats),
      languages: i.languages,
      registrations: i.registrations,
      approval_required: i.approval_required,
      configuration: {
        statuses: {
          max_characters: i.configuration.statuses.max_characters,
          max_media_attachments: i.configuration.statuses.max_media_attachments,
          characters_reserved_per_url: i.configuration.statuses.characters_reserved_per_url
        },
        polls: {
          max_options: i.configuration.polls.max_options,
          max_characters_per_option: i.configuration.polls.max_characters_per_option,
          min_expiration: i.configuration.polls.min_expiration,
          max_expiration: i.configuration.polls.max_expiration
        }
      },
      contact_account: account(i.contact_account),
      rules: i.rules
    })
    export const marker = (m: Entity.Marker | Record<never, never>): MegalodonEntity.Marker | Record<never, never> => m
    export const mention = (m: Entity.Mention): MegalodonEntity.Mention => m
    export const notification = (n: Entity.Notification): MegalodonEntity.Notification | UnknownNotificationTypeError => {
      const notificationType = decodeNotificationType(n.type)
      if (notificationType instanceof UnknownNotificationTypeError) return notificationType
      if (n.status) {
        return {
          account: account(n.account),
          created_at: n.created_at,
          id: n.id,
          status: status(n.status),
          type: notificationType
        }
      } else {
        return {
          account: account(n.account),
          created_at: n.created_at,
          id: n.id,
          type: notificationType
        }
      }
    }
    export const poll = (p: Entity.Poll): MegalodonEntity.Poll => p
    export const poll_option = (p: Entity.PollOption): MegalodonEntity.PollOption => p
    export const preferences = (p: Entity.Preferences): MegalodonEntity.Preferences => p
    export const relationship = (r: Entity.Relationship): MegalodonEntity.Relationship => r
    export const report = (r: Entity.Report): MegalodonEntity.Report => ({
      id: r.id,
      action_taken: r.action_taken,
      action_taken_at: r.action_taken_at,
      status_ids: r.status_ids,
      rule_ids: r.rule_ids,
      category: r.category,
      comment: r.comment,
      forwarded: r.forwarded,
      target_account: account(r.target_account)
    })
    export const results = (r: Entity.Results): MegalodonEntity.Results => ({
      accounts: Array.isArray(r.accounts) ? r.accounts.map(a => account(a)) : [],
      statuses: Array.isArray(r.statuses) ? r.statuses.map(s => status(s)) : [],
      hashtags: Array.isArray(r.hashtags) ? r.hashtags.map(h => tag(h)) : []
    })
    export const scheduled_status = (s: Entity.ScheduledStatus): MegalodonEntity.ScheduledStatus => s
    export const source = (s: Entity.Source): MegalodonEntity.Source => s
    export const stats = (s: Entity.Stats): MegalodonEntity.Stats => s
    export const status = (s: Entity.Status): MegalodonEntity.Status => ({
      id: s.id,
      uri: s.uri,
      url: s.url,
      account: account(s.account),
      in_reply_to_id: s.in_reply_to_id,
      in_reply_to_account_id: s.in_reply_to_account_id,
      reblog: s.reblog ? status(s.reblog) : null,
      content: s.content,
      plain_content: null,
      created_at: s.created_at,
      edited_at: s.edited_at,
      emojis: Array.isArray(s.emojis) ? s.emojis.map(e => emoji(e)) : [],
      replies_count: s.replies_count,
      reblogs_count: s.reblogs_count,
      favourites_count: s.favourites_count,
      reblogged: s.reblogged,
      favourited: s.favourited,
      muted: s.muted,
      sensitive: s.sensitive,
      spoiler_text: s.spoiler_text,
      visibility: s.visibility,
      media_attachments: Array.isArray(s.media_attachments) ? s.media_attachments.map(m => attachment(m)) : [],
      mentions: Array.isArray(s.mentions) ? s.mentions.map(m => mention(m)) : [],
      tags: s.tags,
      card: null,
      poll: s.poll ? poll(s.poll) : null,
      application: s.application ? application(s.application) : null,
      language: s.language,
      pinned: false,
      emoji_reactions: [],
      bookmarked: s.bookmarked ? s.bookmarked : false,
      quote: false
    })
    export const status_params = (s: Entity.StatusParams): MegalodonEntity.StatusParams => s
    export const tag = (t: Entity.Tag): MegalodonEntity.Tag => t
    export const token = (t: Entity.Token): MegalodonEntity.Token => t
  }
}
export default PixelfedAPI
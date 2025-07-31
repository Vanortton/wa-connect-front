interface Long {
    low: number
}

interface IMessageKey {
    remoteJid: string
    fromMe?: boolean | null
    id: string
    participant?: string | null
}

interface IImageMessage {
    downloadUrl: string
    caption?: string
    mimetype: string
    fileLength: number
    jpegThumbnail: string
    height: number
    width: number
    viewOnce: boolean
}

interface IContactMessage {
    displayName: string
    vcard: string
}

interface ILocationMessage {
    degreesLatitude: number
    degreesLongitude: number
}

interface IExtendedTextMessage {
    text: string
    matchedText: string
    description: string
    title: string
    jpegThumbnail: string
}

interface IDocumentMessage {
    downloadUrl: string
    mimetype: string
    fileLength: number
    pageCount?: number
    fileName: string
    jpegThumbnail?: string
    caption: string
}

interface IAudioMessage {
    downloadUrl: string
    mimetype: string
    seconds: number
    waveform?: string
}

interface IVideoMessage {
    downloadUrl: string
    mimetype: string
    fileLength: string
    seconds: string
    caption: string
    gifPlayback: string
    jpegThumbnail: string
}

interface IProtocolMessage {
    key: IMessageKey
    type: 'MESSAGE_EDIT' | 'REVOKE'
    editedMessage:
        | { conversation?: string }
        | { extendedTextMessage: IExtendedTextMessage }
}

interface IStickerMessage {
    downloadUrl: string
    isAnimated: boolean
    pngThumbnail?: string
    isAvatar: boolean
    isAiSticker: boolean
    accessibilityLabel: string
}

interface IReactionMessage {
    key: IMessageKey
    text: string
    groupingKey?: string
    senderTimestampMs: number | Long
}

interface IMessageContextInfo {
    stanzaId: string
    participant: string
    quotedMessage: IMessage
    remoteJid: string
    forwardingScore?: number
    isForwarded: boolean
}

interface IMessageBase {
    contextInfo: IMessageContextInfo
}

interface IMessage {
    conversation?: string
    imageMessage?: IImageMessage & IMessageBase
    contactMessage?: IContactMessage & IMessageBase
    locationMessage?: ILocationMessage & IMessageBase
    extendedTextMessage?: IExtendedTextMessage & IMessageBase
    documentMessage?: IDocumentMessage & IMessageBase
    audioMessage?: IAudioMessage & IMessageBase
    videoMessage?: IVideoMessage & IMessageBase
    protocolMessage?: IProtocolMessage & IMessageBase
    contactsArrayMessage?: IContactMessage[] & IMessageBase
    stickerMessage?: IStickerMessage & IMessageBase
    reactionMessage?: IReactionMessage & IMessageBase
    // liveLocationMessage?: ILiveLocationMessage | null
}

type Status = 0 | 1 | 2 | 3 | 4 | 5

const StatusValues = {
    ERROR: 0 as Status,
    PENDING: 1 as Status,
    SERVER_ACK: 2 as Status,
    DELIVERY_ACK: 3 as Status,
    READ: 4 as Status,
    PLAYED: 5 as Status,
} as const

type Stub =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48
    | 49
    | 50
    | 51
    | 52
    | 53
    | 54
    | 55
    | 56
    | 57
    | 58
    | 59
    | 60
    | 61
    | 62
    | 63
    | 64
    | 65
    | 66
    | 67
    | 68
    | 69
    | 70
    | 71
    | 72
    | 73
    | 74
    | 75
    | 76
    | 77
    | 78
    | 79
    | 80
    | 81
    | 82
    | 83
    | 84
    | 85
    | 86
    | 87
    | 88
    | 89
    | 90
    | 91
    | 92
    | 93
    | 94
    | 95
    | 96
    | 97
    | 98
    | 99
    | 100
    | 101
    | 102
    | 103
    | 104
    | 105
    | 106
    | 107
    | 108
    | 109
    | 110
    | 111
    | 112
    | 113
    | 114
    | 115
    | 116
    | 117
    | 118
    | 119
    | 120
    | 121
    | 122
    | 123
    | 124
    | 125
    | 126
    | 127
    | 128
    | 129
    | 130
    | 131
    | 132
    | 133
    | 134
    | 135
    | 136
    | 137
    | 138
    | 139
    | 140
    | 141
    | 142
    | 143
    | 144
    | 145
    | 146
    | 147
    | 148
    | 149
    | 150
    | 151
    | 152
    | 153
    | 154
    | 155
    | 156
    | 157
    | 158
    | 159
    | 160
    | 161
    | 162
    | 163
    | 164
    | 165
    | 166
    | 167
    | 168
    | 169
    | 170
    | 171
    | 172
    | 173
    | 174
    | 175
    | 176
    | 177
    | 178
    | 179
    | 180
    | 181
    | 182
    | 183
    | 184
    | 185
    | 186
    | 187
    | 188
    | 189
    | 190
    | 191
    | 192
    | 193
    | 194
    | 195
    | 196
    | 197
    | 198
    | 199
    | 200
    | 201
    | 202
    | 203
    | 204
    | 205
    | 206
    | 207
    | 208
    | 209
    | 210
    | 211
    | 212
    | 213
    | 214
    | 215
    | 216
    | 217
    | 218

const StubType = {
    UNKNOWN: 0 as Stub,
    REVOKE: 1 as Stub,
    CIPHERTEXT: 2 as Stub,
    FUTUREPROOF: 3 as Stub,
    NON_VERIFIED_TRANSITION: 4 as Stub,
    UNVERIFIED_TRANSITION: 5 as Stub,
    VERIFIED_TRANSITION: 6 as Stub,
    VERIFIED_LOW_UNKNOWN: 7 as Stub,
    VERIFIED_HIGH: 8 as Stub,
    VERIFIED_INITIAL_UNKNOWN: 9 as Stub,
    VERIFIED_INITIAL_LOW: 10 as Stub,
    VERIFIED_INITIAL_HIGH: 11 as Stub,
    VERIFIED_TRANSITION_ANY_TO_NONE: 12 as Stub,
    VERIFIED_TRANSITION_ANY_TO_HIGH: 13 as Stub,
    VERIFIED_TRANSITION_HIGH_TO_LOW: 14 as Stub,
    VERIFIED_TRANSITION_HIGH_TO_UNKNOWN: 15 as Stub,
    VERIFIED_TRANSITION_UNKNOWN_TO_LOW: 16 as Stub,
    VERIFIED_TRANSITION_LOW_TO_UNKNOWN: 17 as Stub,
    VERIFIED_TRANSITION_NONE_TO_LOW: 18 as Stub,
    VERIFIED_TRANSITION_NONE_TO_UNKNOWN: 19 as Stub,
    GROUP_CREATE: 20 as Stub,
    GROUP_CHANGE_SUBJECT: 21 as Stub,
    GROUP_CHANGE_ICON: 22 as Stub,
    GROUP_CHANGE_INVITE_LINK: 23 as Stub,
    GROUP_CHANGE_DESCRIPTION: 24 as Stub,
    GROUP_CHANGE_RESTRICT: 25 as Stub,
    GROUP_CHANGE_ANNOUNCE: 26 as Stub,
    GROUP_PARTICIPANT_ADD: 27 as Stub,
    GROUP_PARTICIPANT_REMOVE: 28 as Stub,
    GROUP_PARTICIPANT_PROMOTE: 29 as Stub,
    GROUP_PARTICIPANT_DEMOTE: 30 as Stub,
    GROUP_PARTICIPANT_INVITE: 31 as Stub,
    GROUP_PARTICIPANT_LEAVE: 32 as Stub,
    GROUP_PARTICIPANT_CHANGE_NUMBER: 33 as Stub,
    BROADCAST_CREATE: 34 as Stub,
    BROADCAST_ADD: 35 as Stub,
    BROADCAST_REMOVE: 36 as Stub,
    GENERIC_NOTIFICATION: 37 as Stub,
    E2E_IDENTITY_CHANGED: 38 as Stub,
    E2E_ENCRYPTED: 39 as Stub,
    CALL_MISSED_VOICE: 40 as Stub,
    CALL_MISSED_VIDEO: 41 as Stub,
    INDIVIDUAL_CHANGE_NUMBER: 42 as Stub,
    GROUP_DELETE: 43 as Stub,
    GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE: 44 as Stub,
    CALL_MISSED_GROUP_VOICE: 45 as Stub,
    CALL_MISSED_GROUP_VIDEO: 46 as Stub,
    PAYMENT_CIPHERTEXT: 47 as Stub,
    PAYMENT_FUTUREPROOF: 48 as Stub,
    PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED: 49 as Stub,
    PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED: 50 as Stub,
    PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED: 51 as Stub,
    PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP: 52 as Stub,
    PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP: 53 as Stub,
    PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER: 54 as Stub,
    PAYMENT_ACTION_SEND_PAYMENT_REMINDER: 55 as Stub,
    PAYMENT_ACTION_SEND_PAYMENT_INVITATION: 56 as Stub,
    PAYMENT_ACTION_REQUEST_DECLINED: 57 as Stub,
    PAYMENT_ACTION_REQUEST_EXPIRED: 58 as Stub,
    PAYMENT_ACTION_REQUEST_CANCELLED: 59 as Stub,
    BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM: 60 as Stub,
    BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP: 61 as Stub,
    BIZ_INTRO_TOP: 62 as Stub,
    BIZ_INTRO_BOTTOM: 63 as Stub,
    BIZ_NAME_CHANGE: 64 as Stub,
    BIZ_MOVE_TO_CONSUMER_APP: 65 as Stub,
    BIZ_TWO_TIER_MIGRATION_TOP: 66 as Stub,
    BIZ_TWO_TIER_MIGRATION_BOTTOM: 67 as Stub,
    OVERSIZED: 68 as Stub,
    GROUP_CHANGE_NO_FREQUENTLY_FORWARDED: 69 as Stub,
    GROUP_V4_ADD_INVITE_SENT: 70 as Stub,
    GROUP_PARTICIPANT_ADD_REQUEST_JOIN: 71 as Stub,
    CHANGE_EPHEMERAL_SETTING: 72 as Stub,
    E2E_DEVICE_CHANGED: 73 as Stub,
    VIEWED_ONCE: 74 as Stub,
    E2E_ENCRYPTED_NOW: 75 as Stub,
    BLUE_MSG_BSP_FB_TO_BSP_PREMISE: 76 as Stub,
    BLUE_MSG_BSP_FB_TO_SELF_FB: 77 as Stub,
    BLUE_MSG_BSP_FB_TO_SELF_PREMISE: 78 as Stub,
    BLUE_MSG_BSP_FB_UNVERIFIED: 79 as Stub,
    BLUE_MSG_BSP_FB_UNVERIFIED_TO_SELF_PREMISE_VERIFIED: 80 as Stub,
    BLUE_MSG_BSP_FB_VERIFIED: 81 as Stub,
    BLUE_MSG_BSP_FB_VERIFIED_TO_SELF_PREMISE_UNVERIFIED: 82 as Stub,
    BLUE_MSG_BSP_PREMISE_TO_SELF_PREMISE: 83 as Stub,
    BLUE_MSG_BSP_PREMISE_UNVERIFIED: 84 as Stub,
    BLUE_MSG_BSP_PREMISE_UNVERIFIED_TO_SELF_PREMISE_VERIFIED: 85 as Stub,
    BLUE_MSG_BSP_PREMISE_VERIFIED: 86 as Stub,
    BLUE_MSG_BSP_PREMISE_VERIFIED_TO_SELF_PREMISE_UNVERIFIED: 87 as Stub,
    BLUE_MSG_CONSUMER_TO_BSP_FB_UNVERIFIED: 88 as Stub,
    BLUE_MSG_CONSUMER_TO_BSP_PREMISE_UNVERIFIED: 89 as Stub,
    BLUE_MSG_CONSUMER_TO_SELF_FB_UNVERIFIED: 90 as Stub,
    BLUE_MSG_CONSUMER_TO_SELF_PREMISE_UNVERIFIED: 91 as Stub,
    BLUE_MSG_SELF_FB_TO_BSP_PREMISE: 92 as Stub,
    BLUE_MSG_SELF_FB_TO_SELF_PREMISE: 93 as Stub,
    BLUE_MSG_SELF_FB_UNVERIFIED: 94 as Stub,
    BLUE_MSG_SELF_FB_UNVERIFIED_TO_SELF_PREMISE_VERIFIED: 95 as Stub,
    BLUE_MSG_SELF_FB_VERIFIED: 96 as Stub,
    BLUE_MSG_SELF_FB_VERIFIED_TO_SELF_PREMISE_UNVERIFIED: 97 as Stub,
    BLUE_MSG_SELF_PREMISE_TO_BSP_PREMISE: 98 as Stub,
    BLUE_MSG_SELF_PREMISE_UNVERIFIED: 99 as Stub,
    BLUE_MSG_SELF_PREMISE_VERIFIED: 100 as Stub,
    BLUE_MSG_TO_BSP_FB: 101 as Stub,
    BLUE_MSG_TO_CONSUMER: 102 as Stub,
    BLUE_MSG_TO_SELF_FB: 103 as Stub,
    BLUE_MSG_UNVERIFIED_TO_BSP_FB_VERIFIED: 104 as Stub,
    BLUE_MSG_UNVERIFIED_TO_BSP_PREMISE_VERIFIED: 105 as Stub,
    BLUE_MSG_UNVERIFIED_TO_SELF_FB_VERIFIED: 106 as Stub,
    BLUE_MSG_UNVERIFIED_TO_VERIFIED: 107 as Stub,
    BLUE_MSG_VERIFIED_TO_BSP_FB_UNVERIFIED: 108 as Stub,
    BLUE_MSG_VERIFIED_TO_BSP_PREMISE_UNVERIFIED: 109 as Stub,
    BLUE_MSG_VERIFIED_TO_SELF_FB_UNVERIFIED: 110 as Stub,
    BLUE_MSG_VERIFIED_TO_UNVERIFIED: 111 as Stub,
    BLUE_MSG_BSP_FB_UNVERIFIED_TO_BSP_PREMISE_VERIFIED: 112 as Stub,
    BLUE_MSG_BSP_FB_UNVERIFIED_TO_SELF_FB_VERIFIED: 113 as Stub,
    BLUE_MSG_BSP_FB_VERIFIED_TO_BSP_PREMISE_UNVERIFIED: 114 as Stub,
    BLUE_MSG_BSP_FB_VERIFIED_TO_SELF_FB_UNVERIFIED: 115 as Stub,
    BLUE_MSG_SELF_FB_UNVERIFIED_TO_BSP_PREMISE_VERIFIED: 116 as Stub,
    BLUE_MSG_SELF_FB_VERIFIED_TO_BSP_PREMISE_UNVERIFIED: 117 as Stub,
    E2E_IDENTITY_UNAVAILABLE: 118 as Stub,
    GROUP_CREATING: 119 as Stub,
    GROUP_CREATE_FAILED: 120 as Stub,
    GROUP_BOUNCED: 121 as Stub,
    BLOCK_CONTACT: 122 as Stub,
    EPHEMERAL_SETTING_NOT_APPLIED: 123 as Stub,
    SYNC_FAILED: 124 as Stub,
    SYNCING: 125 as Stub,
    BIZ_PRIVACY_MODE_INIT_FB: 126 as Stub,
    BIZ_PRIVACY_MODE_INIT_BSP: 127 as Stub,
    BIZ_PRIVACY_MODE_TO_FB: 128 as Stub,
    BIZ_PRIVACY_MODE_TO_BSP: 129 as Stub,
    DISAPPEARING_MODE: 130 as Stub,
    E2E_DEVICE_FETCH_FAILED: 131 as Stub,
    ADMIN_REVOKE: 132 as Stub,
    GROUP_INVITE_LINK_GROWTH_LOCKED: 133 as Stub,
    COMMUNITY_LINK_PARENT_GROUP: 134 as Stub,
    COMMUNITY_LINK_SIBLING_GROUP: 135 as Stub,
    COMMUNITY_LINK_SUB_GROUP: 136 as Stub,
    COMMUNITY_UNLINK_PARENT_GROUP: 137 as Stub,
    COMMUNITY_UNLINK_SIBLING_GROUP: 138 as Stub,
    COMMUNITY_UNLINK_SUB_GROUP: 139 as Stub,
    GROUP_PARTICIPANT_ACCEPT: 140 as Stub,
    GROUP_PARTICIPANT_LINKED_GROUP_JOIN: 141 as Stub,
    COMMUNITY_CREATE: 142 as Stub,
    EPHEMERAL_KEEP_IN_CHAT: 143 as Stub,
    GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST: 144 as Stub,
    GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE: 145 as Stub,
    INTEGRITY_UNLINK_PARENT_GROUP: 146 as Stub,
    COMMUNITY_PARTICIPANT_PROMOTE: 147 as Stub,
    COMMUNITY_PARTICIPANT_DEMOTE: 148 as Stub,
    COMMUNITY_PARENT_GROUP_DELETED: 149 as Stub,
    COMMUNITY_LINK_PARENT_GROUP_MEMBERSHIP_APPROVAL: 150 as Stub,
    GROUP_PARTICIPANT_JOINED_GROUP_AND_PARENT_GROUP: 151 as Stub,
    MASKED_THREAD_CREATED: 152 as Stub,
    MASKED_THREAD_UNMASKED: 153 as Stub,
    BIZ_CHAT_ASSIGNMENT: 154 as Stub,
    CHAT_PSA: 155 as Stub,
    CHAT_POLL_CREATION_MESSAGE: 156 as Stub,
    CAG_MASKED_THREAD_CREATED: 157 as Stub,
    COMMUNITY_PARENT_GROUP_SUBJECT_CHANGED: 158 as Stub,
    CAG_INVITE_AUTO_ADD: 159 as Stub,
    BIZ_CHAT_ASSIGNMENT_UNASSIGN: 160 as Stub,
    CAG_INVITE_AUTO_JOINED: 161 as Stub,
    SCHEDULED_CALL_START_MESSAGE: 162 as Stub,
    COMMUNITY_INVITE_RICH: 163 as Stub,
    COMMUNITY_INVITE_AUTO_ADD_RICH: 164 as Stub,
    SUB_GROUP_INVITE_RICH: 165 as Stub,
    SUB_GROUP_PARTICIPANT_ADD_RICH: 166 as Stub,
    COMMUNITY_LINK_PARENT_GROUP_RICH: 167 as Stub,
    COMMUNITY_PARTICIPANT_ADD_RICH: 168 as Stub,
    SILENCED_UNKNOWN_CALLER_AUDIO: 169 as Stub,
    SILENCED_UNKNOWN_CALLER_VIDEO: 170 as Stub,
    GROUP_MEMBER_ADD_MODE: 171 as Stub,
    GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD: 172 as Stub,
    COMMUNITY_CHANGE_DESCRIPTION: 173 as Stub,
    SENDER_INVITE: 174 as Stub,
    RECEIVER_INVITE: 175 as Stub,
    COMMUNITY_ALLOW_MEMBER_ADDED_GROUPS: 176 as Stub,
    PINNED_MESSAGE_IN_CHAT: 177 as Stub,
    PAYMENT_INVITE_SETUP_INVITER: 178 as Stub,
    PAYMENT_INVITE_SETUP_INVITEE_RECEIVE_ONLY: 179 as Stub,
    PAYMENT_INVITE_SETUP_INVITEE_SEND_AND_RECEIVE: 180 as Stub,
    LINKED_GROUP_CALL_START: 181 as Stub,
    REPORT_TO_ADMIN_ENABLED_STATUS: 182 as Stub,
    EMPTY_SUBGROUP_CREATE: 183 as Stub,
    SCHEDULED_CALL_CANCEL: 184 as Stub,
    SUBGROUP_ADMIN_TRIGGERED_AUTO_ADD_RICH: 185 as Stub,
    GROUP_CHANGE_RECENT_HISTORY_SHARING: 186 as Stub,
    PAID_MESSAGE_SERVER_CAMPAIGN_ID: 187 as Stub,
    GENERAL_CHAT_CREATE: 188 as Stub,
    GENERAL_CHAT_ADD: 189 as Stub,
    GENERAL_CHAT_AUTO_ADD_DISABLED: 190 as Stub,
    SUGGESTED_SUBGROUP_ANNOUNCE: 191 as Stub,
    BIZ_BOT_1P_MESSAGING_ENABLED: 192 as Stub,
    CHANGE_USERNAME: 193 as Stub,
    BIZ_COEX_PRIVACY_INIT_SELF: 194 as Stub,
    BIZ_COEX_PRIVACY_TRANSITION_SELF: 195 as Stub,
    SUPPORT_AI_EDUCATION: 196 as Stub,
    BIZ_BOT_3P_MESSAGING_ENABLED: 197 as Stub,
    REMINDER_SETUP_MESSAGE: 198 as Stub,
    REMINDER_SENT_MESSAGE: 199 as Stub,
    REMINDER_CANCEL_MESSAGE: 200 as Stub,
    BIZ_COEX_PRIVACY_INIT: 201 as Stub,
    BIZ_COEX_PRIVACY_TRANSITION: 202 as Stub,
    GROUP_DEACTIVATED: 203 as Stub,
    COMMUNITY_DEACTIVATE_SIBLING_GROUP: 204 as Stub,
    EVENT_UPDATED: 205 as Stub,
    EVENT_CANCELED: 206 as Stub,
    COMMUNITY_OWNER_UPDATED: 207 as Stub,
    COMMUNITY_SUB_GROUP_VISIBILITY_HIDDEN: 208 as Stub,
    CAPI_GROUP_NE2EE_SYSTEM_MESSAGE: 209 as Stub,
    STATUS_MENTION: 210 as Stub,
    USER_CONTROLS_SYSTEM_MESSAGE: 211 as Stub,
    SUPPORT_SYSTEM_MESSAGE: 212 as Stub,
    CHANGE_LID: 213 as Stub,
    BIZ_CUSTOMER_3PD_DATA_SHARING_OPT_IN_MESSAGE: 214 as Stub,
    BIZ_CUSTOMER_3PD_DATA_SHARING_OPT_OUT_MESSAGE: 215 as Stub,
    CHANGE_LIMIT_SHARING: 216 as Stub,
    GROUP_MEMBER_LINK_MODE: 217 as Stub,
    BIZ_AUTOMATICALLY_LABELED_CHAT_SYSTEM_MESSAGE: 218 as Stub,
} as const

interface IUserReceipt {
    userJid: string
    receiptTimestamp?: number | Long | null
    readTimestamp?: number | Long | null
    playedTimestamp?: number | Long | null
    pendingDeviceJid?: string[] | null
    deliveredDeviceJid?: string[] | null
}

interface IReaction {
    key?: IMessageKey | null
    text?: string | null
    groupingKey?: string | null
    senderTimestampMs?: number | Long | null
    unread?: boolean | null
}

type MediaMessageTypes = 'image' | 'video' | 'audio' | 'document' | 'sticker'
type MediaMessageContents = IMessage[
    | 'audioMessage'
    | 'imageMessage'
    | 'videoMessage'
    | 'documentMessage']

interface IWebMessageInfo {
    key: IMessageKey
    message: IMessage
    messageTimestamp: number
    status: typeof StatusValues
    participant?: string
    ignore?: boolean
    starred?: boolean
    broadcast?: boolean
    pushName: string
    messageStubType?: typeof StubType
    clearMedia?: boolean
    labels?: string[]
    userReceipt?: IUserReceipt[]
    reactions?: IReaction[]
    deleted?: boolean
    // finalLiveLocation?: Message.ILiveLocationMessage | null
}

export { StatusValues, StubType }
export type {
    IAudioMessage,
    IExtendedTextMessage,
    IMessage,
    IWebMessageInfo,
    MediaMessageContents,
    MediaMessageTypes,
}

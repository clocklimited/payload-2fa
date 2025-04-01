import type {
	DefaultTranslationsObject,
	I18nOptions
} from '@payloadcms/translations'

import type { CustomTranslationsObject } from './types.js'

import { ar } from './ar.js'
import { az } from './az.js'
import { bg } from './bg.js'
import { ca } from './ca.js'
import { cs } from './cs.js'
import { da } from './da.js'
import { de } from './de.js'
import { en } from './en.js'
import { es } from './es.js'
import { et } from './et.js'
import { fa } from './fa.js'
import { fr } from './fr.js'
import { he } from './he.js'
import { hr } from './hr.js'
import { hu } from './hu.js'
import { it } from './it.js'
import { ja } from './ja.js'
import { ko } from './ko.js'
import { lt } from './lt.js'
import { my } from './my.js'
import { nb } from './nb.js'
import { nl } from './nl.js'
import { pl } from './pl.js'
import { pt } from './pt.js'
import { ro } from './ro.js'
import { rs } from './rs.js'
import { rsLatin } from './rsLatin.js'
import { ru } from './ru.js'
import { sk } from './sk.js'
import { sl } from './sl.js'
import { sv } from './sv.js'
import { th } from './th.js'
import { tr } from './tr.js'
import { uk } from './uk.js'
import { vi } from './vi.js'
import { zh } from './zh.js'
import { zhTw } from './zhTw.js'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const i18n = (incomingI18n?: I18nOptions<{} | DefaultTranslationsObject>) =>
	({
		...(incomingI18n || {}),
		translations: {
			...(incomingI18n?.translations || {}),
			ar: {
				...(incomingI18n?.translations?.ar || {}),
				...ar,
			},
			az: {
				...(incomingI18n?.translations?.az || {}),
				...az,
			},
			bg: {
				...(incomingI18n?.translations?.bg || {}),
				...bg,
			},
			ca: {
				...(incomingI18n?.translations?.ca || {}),
				...ca,
			},
			cs: {
				...(incomingI18n?.translations?.cs || {}),
				...cs,
			},
			da: {
				...(incomingI18n?.translations?.da || {}),
				...da,
			},
			de: {
				...(incomingI18n?.translations?.de || {}),
				...de,
			},
			en: {
				...(incomingI18n?.translations?.en || {}),
				...en,
			},
			es: {
				...(incomingI18n?.translations?.es || {}),
				...es,
			},
			et: {
				...(incomingI18n?.translations?.et || {}),
				...et,
			},
			fa: {
				...(incomingI18n?.translations?.fa || {}),
				...fa,
			},
			fr: {
				...(incomingI18n?.translations?.fr || {}),
				...fr,
			},
			he: {
				...(incomingI18n?.translations?.he || {}),
				...he,
			},
			hr: {
				...(incomingI18n?.translations?.hr || {}),
				...hr,
			},
			hu: {
				...(incomingI18n?.translations?.hu || {}),
				...hu,
			},
			it: {
				...(incomingI18n?.translations?.it || {}),
				...it,
			},
			ja: {
				...(incomingI18n?.translations?.ja || {}),
				...ja,
			},
			ko: {
				...(incomingI18n?.translations?.ko || {}),
				...ko,
			},
			lt: {
				...(incomingI18n?.translations?.lt || {}),
				...lt,
			},
			my: {
				...(incomingI18n?.translations?.my || {}),
				...my,
			},
			nb: {
				...(incomingI18n?.translations?.nb || {}),
				...nb,
			},
			nl: {
				...(incomingI18n?.translations?.nl || {}),
				...nl,
			},
			pl: {
				...(incomingI18n?.translations?.pl || {}),
				...pl,
			},
			pt: {
				...(incomingI18n?.translations?.pt || {}),
				...pt,
			},
			ro: {
				...(incomingI18n?.translations?.ro || {}),
				...ro,
			},
			rs: {
				...(incomingI18n?.translations?.rs || {}),
				...rs,
			},
			"rs-latin": {
				...(incomingI18n?.translations?.['rs-latin'] || {}),
				...rsLatin,
			},
			ru: {
				...(incomingI18n?.translations?.ru || {}),
				...ru,
			},
			sk: {
				...(incomingI18n?.translations?.sk || {}),
				...sk,
			},
			sl: {
				...(incomingI18n?.translations?.sl || {}),
				...sl,
			},
			sv: {
				...(incomingI18n?.translations?.sv || {}),
				...sv,
			},
			th: {
				...(incomingI18n?.translations?.th || {}),
				...th,
			},
			tr: {
				...(incomingI18n?.translations?.tr || {}),
				...tr,
			},
			uk: {
				...(incomingI18n?.translations?.uk || {}),
				...uk,
			},
			vi: {
				...(incomingI18n?.translations?.vi || {}),
				...vi,
			},
			zh: {
				...(incomingI18n?.translations?.zh || {}),
				...zh,
			},
			"zh-TW": {
				...(incomingI18n?.translations?.['zh-TW'] || {}),
				...zhTw,
			},
		},
	}) as I18nOptions<CustomTranslationsObject | DefaultTranslationsObject>
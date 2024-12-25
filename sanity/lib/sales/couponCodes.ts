export const COUPON_CODES = {
    BLACKFRIDAY: "BLACKFRIDAY",
    black2025: "black2025",
    NY2025: "NY2025",
    CHRI2024: "CHRI2024"
} as const;


export type CouponCode = keyof typeof COUPON_CODES;
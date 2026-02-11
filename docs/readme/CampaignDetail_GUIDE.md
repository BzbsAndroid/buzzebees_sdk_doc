# Campaign Detail Guide

Complete guide for campaign detail retrieval, validation, and redemption using `CampaignDetailUseCase`.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Configuration](#configuration)
4. [API Reference](#api-reference)
5. [Campaign Types & Button Catalog](#campaign-types--button-catalog)
6. [Selection Methods](#selection-methods)
7. [Validation & Error Handling](#validation--error-handling)
8. [Redemption Flow Logic](#redemption-flow-logic)
9. [Complete Flow Examples](#complete-flow-examples)
10. [Entity Reference](#entity-reference)

---

## Overview

The `CampaignDetailUseCase` provides complete campaign detail management including:

- Campaign detail retrieval with automatic validation
- Variant/sub-variant selection for BUY campaigns
- Address selection for delivery campaigns
- Quantity management for BUY/DONATE campaigns
- Unified redemption flow with next step guidance
- Points query with caching
- Localization support via `setConfig()`

### Standard Campaign Flow

```
1. getCampaignDetail()     → Get campaign info + auto validation
2. Check canRedeem         → SDK validates business rules automatically
3. Handle result:
   ├── canRedeem = true    → Show button based on campaignCatalog → redeem()
   └── canRedeem = false   → Show error from errorConditionMessage
4. Handle NextStep         → Show appropriate UI after redemption
```

### Getting an Instance

```kotlin
val campaignDetailService = BuzzebeesSDK.instance().campaignDetailUseCase
```

---

## Quick Start

```kotlin
// 1. Set config once at initialization
campaignDetailService.setConfig(CampaignConfigBuilder.thai())

// 2. Get campaign detail
val result = campaignDetailService.getCampaignDetail(id = "12345")

when (result) {
    is CampaignDetailResult.SuccessCampaignDetail -> {
        val detail = result.result
        
        // Check if ready to redeem
        if (detail.canRedeem == true) {
            // Show button based on catalog
            when (detail.campaignCatalog) {
                is CampaignButtonCatalog.RedeemButton -> showRedeemButton()
                is CampaignButtonCatalog.ShoppingWithStyleButton -> showVariantSelector()
                // ... handle other types
            }
        } else {
            // Show error message
            showError(detail.errorConditionMessage)
        }
    }
    is CampaignDetailResult.Error -> showError(result.error.message)
}

// 3. Redeem when ready
val redeemResult = campaignDetailService.redeem(mapOf())
```

---

## Configuration

### setConfig

Set display configuration once at initialization. All button names, error messages, and condition alerts will use these texts automatically.

```kotlin
fun setConfig(builder: CampaignConfigBuilder)
```

### Available Presets

```kotlin
CampaignConfigBuilder.english()  // English (default)
CampaignConfigBuilder.thai()     // Thai

```

### Configuration Fields

#### Button Names

| Field | English (Default) | Thai |
|-------|-------------------|------|
| buttonShopNow | "Shop Now" | "ซื้อเลย" |
| buttonAddToCart | "Add to Cart" | "เพิ่มในตะกร้า" |
| buttonTakeSurvey | "Take Survey" | "ทำแบบสอบถาม" |
| buttonOpen | "Open" | "เปิด" |
| buttonDraw | "Draw" | "จับรางวัล" |
| buttonDonate | "Donate" | "บริจาค" |
| buttonRedeem | "Redeem" | "แลก" |
| buttonGetPoints | "Get Points" | "รับแต้ม" |

#### Condition Alerts

| Field | English (Default) | Thai |
|-------|-------------------|------|
| alertSoldOut | "Campaign sold out" | "สินค้าหมด" |
| alertMaxRedemption | "Max redemption per person reached" | "แลกครบจำนวนสูงสุดต่อคนแล้ว" |
| alertCoolDown | "Campaign in cool down period" | "อยู่ในช่วงพักการแลก" |
| alertConditionInvalid | "Condition invalid" | "เงื่อนไขไม่ถูกต้อง" |
| alertSponsorOnly | "Sponsor only campaign" | "สำหรับสปอนเซอร์เท่านั้น" |
| alertExpired | "Campaign expired" | "แคมเปญหมดอายุ" |
| alertNotStarted | "Campaign not started yet" | "แคมเปญยังไม่เริ่ม" |
| alertAppVersionExpired | "App version expired" | "กรุณาอัปเดตแอป" |
| alertTermsConditions | "This privilege cannot be redeemed..." | "ไม่สามารถแลกได้ตามเงื่อนไขที่กำหนด" |
| alertUnknown | "Unknown condition error" | "เกิดข้อผิดพลาด" |

#### Validation Errors

| Field | English (Default) | Thai |
|-------|-------------------|------|
| errorNotAuthenticated | "Not Authenticated" | "กรุณาเข้าสู่ระบบ" |
| errorCampaignExpired | "Campaign Expired" | "แคมเปญหมดอายุ" |
| errorCampaignSoldOut | "Campaign sold out" | "สินค้าหมด" |
| errorCampaignNotLoaded | "Campaign not loaded" | "ไม่พบข้อมูลแคมเปญ" |
| errorVariantOnlyForBuy | "Variant selection only for BUY campaigns" | "เลือกตัวเลือกได้เฉพาะสินค้าประเภทซื้อ" |
| errorSubVariantOnlyForBuy | "Sub-variant selection only for BUY campaigns" | "เลือกตัวเลือกย่อยได้เฉพาะสินค้าประเภทซื้อ" |
| errorVariantOutOfStock | "Selected variant is out of stock" | "ตัวเลือกที่เลือกหมด" |
| errorSubVariantOutOfStock | "Selected sub-variant is out of stock" | "ตัวเลือกย่อยที่เลือกหมด" |
| errorSelectVariantFirst | "Please select a variant first" | "กรุณาเลือกตัวเลือกหลักก่อน" |
| errorQuantityMinimum | "Quantity must be at least 1" | "จำนวนต้องมากกว่า 0" |
| errorTokenRequired | "Token is required" | "กรุณาเข้าสู่ระบบ" |
| errorAddToCartFailed | "Failed to add to cart" | "เพิ่มในตะกร้าไม่สำเร็จ" |
| errorRedeemKeyNotFound | "Redeem key not found. Please redeem first." | "ไม่พบรหัสแลก กรุณาแลกสิทธิ์ก่อน" |

#### Address Validation Errors

| Field | English (Default) | Thai |
|-------|-------------------|------|
| errorAddressNotRequired | "Address not required for this campaign" | "ไม่ต้องเลือกที่อยู่สำหรับแคมเปญนี้" |
| errorInvalidAddress | "Invalid address" | "ที่อยู่ไม่ถูกต้อง" |
| errorInvalidAddressSelected | "Invalid address selected" | "ที่อยู่ที่เลือกไม่ถูกต้อง" |
| errorSelectAddress | "Please select a delivery address" | "กรุณาเลือกที่อยู่จัดส่ง" |
| errorAddressRequired | "Address is required" | "กรุณาระบุที่อยู่" |

#### Selection Validation Errors

| Field | English (Default) | Thai |
|-------|-------------------|------|
| errorSelectVariant | "Please select a variant" | "กรุณาเลือกตัวเลือก" |
| errorSelectSubVariant | "Please select a sub-variant" | "กรุณาเลือกตัวเลือกย่อย" |
| errorInvalidVariant | "Invalid variant selection" | "ตัวเลือกไม่ถูกต้อง" |
| errorInvalidQuantity | "Invalid quantity" | "จำนวนไม่ถูกต้อง" |
| errorInvalidCampaignType | "Invalid campaign type" | "ประเภทแคมเปญไม่ถูกต้อง" |

### Builder Methods

#### Individual Setters
```kotlin
// Set individual button text
builder.buttonText(ButtonType.REDEEM, "แลกเลย!")

// Set individual condition alert
builder.conditionAlert(ConditionType.SOLD_OUT, "หมดแล้วจ้า 😢")

// Set individual error message
builder.errorMessage(ErrorType.INSUFFICIENT_POINTS, "แต้มไม่พอจ้า")
```

#### Batch Setters
```kotlin
// Set multiple button texts at once
builder.buttonTexts(
    redeem = "แลกเลย",
    draw = "จับรางวัล"
)

// Set multiple condition alerts at once
builder.conditionAlerts(
    soldOut = "สินค้าหมด",
    expired = "หมดอายุแล้ว"
)
```

#### Preset Methods
```kotlin
// Apply Thai presets
builder.thaiButtonTexts()
builder.thaiConditionAlerts()
builder.thaiErrorMessages()

// Apply English presets
builder.englishButtonTexts()
builder.englishConditionAlerts()
builder.englishErrorMessages()
```

### Available Enums

#### ButtonType
- `SHOP_NOW` - "Shop Now" button
- `ADD_TO_CART` - "Add to Cart" button  
- `TAKE_SURVEY` - Survey button
- `OPEN` - "Open" button
- `DRAW` - "Draw" button
- `DONATE` - "Donate" button
- `REDEEM` - "Redeem" button
- `GET_POINTS` - "Get Points" button

#### ConditionType
- `SOLD_OUT` - Campaign sold out
- `MAX_REDEMPTION` - Max redemption reached
- `COOL_DOWN` - Cool down period
- `CONDITION_INVALID` - Invalid condition
- `SPONSOR_ONLY` - Sponsor only
- `EXPIRED` - Campaign expired
- `NOT_STARTED` - Not started yet
- `APP_VERSION_EXPIRED` - App version expired
- `TERMS_CONDITIONS` - Terms issue
- `UNKNOWN` - Unknown error

#### ErrorType
- `NOT_AUTHENTICATED` - Not authenticated
- `INSUFFICIENT_POINTS` - Insufficient points
- `CAMPAIGN_EXPIRED` - Campaign expired
- `CAMPAIGN_SOLD_OUT` - Campaign sold out
- `CAMPAIGN_NOT_LOADED` - Campaign not loaded
- `VARIANT_ONLY_FOR_BUY` - Variant only for BUY
- `SUB_VARIANT_ONLY_FOR_BUY` - Sub-variant only for BUY
- `VARIANT_OUT_OF_STOCK` - Variant out of stock
- `SUB_VARIANT_OUT_OF_STOCK` - Sub-variant out of stock
- `SELECT_VARIANT_FIRST` - Must select variant first
- `ADDRESS_NOT_REQUIRED` - Address not required
- `INVALID_ADDRESS` - Invalid address
- `QUANTITY_MINIMUM` - Quantity minimum
- `ONLY_X_AVAILABLE` - Only X items available
- `MAX_DONATE_ALLOWED` - Max donate exceeded
- `SELECT_ADDRESS` - Please select address
- `INVALID_ADDRESS_SELECTED` - Invalid address selected
- `SELECT_VARIANT` - Please select variant
- `SELECT_SUB_VARIANT` - Please select sub-variant
- `TOKEN_REQUIRED` - Token required
- `ADD_TO_CART_FAILED` - Add to cart failed
- `INVALID_CAMPAIGN_TYPE` - Invalid campaign type
- `ADDRESS_REQUIRED` - Address required
- `INVALID_VARIANT` - Invalid variant
- `INVALID_QUANTITY` - Invalid quantity
- `REDEEM_KEY_REQUIRED` - Redeem key required
- `REDEEM_KEY_NOT_FOUND` - Redeem key not found

### Usage Examples

```kotlin
// Option 1: Use Thai language
campaignDetailService.setConfig(CampaignConfigBuilder.thai())

// Option 2: Use English (default)
campaignDetailService.setConfig(CampaignConfigBuilder.english())

// Option 3: Custom configuration - individual setters
campaignDetailService.setConfig(
    CampaignConfigBuilder.thai()
        .buttonText(ButtonType.REDEEM, "แลกสิทธิ์")
        .buttonText(ButtonType.SHOP_NOW, "ช้อปเลย")
        .errorMessage(ErrorType.CAMPAIGN_SOLD_OUT, "สินค้าหมดแล้วจ้า")
)

// Option 4: Custom configuration - batch setters
campaignDetailService.setConfig(
    CampaignConfigBuilder.thai()
        .buttonTexts(
            redeem = "แลกสิทธิ์",
            shopNow = "ช้อปเลย"
        )
)
```

### When to Call

- **At app startup** - Set once in Application class or main Activity
- **On language change** - Update when user changes app language

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        BuzzebeesSDK.init(this, config)
        BuzzebeesSDK.instance().campaignDetailUseCase.setConfig(
            CampaignConfigBuilder.thai()
        )
    }
}
```

---

## API Reference

### getCampaignDetail

Retrieves detailed information for a specific campaign. Automatically validates campaign readiness, calculates button catalog, and normalizes display data.

```kotlin
// Suspend
suspend fun getCampaignDetail(
    id: String,
    deviceLocale: Int? = null,
    options: Map<String, String> = mapOf()
): CampaignDetailResult

// Callback
fun getCampaignDetail(
    id: String,
    deviceLocale: Int? = null,
    options: Map<String, String> = mapOf(),
    callback: (CampaignDetailResult) -> Unit
)
```

#### Parameters

| Parameter | Description | Required | Type |
|-----------|-------------|----------|------|
| id | Campaign identifier | Yes | String |
| deviceLocale | Device locale code | No | Int? |
| options | Additional options | No | Map<String, String> |

#### Response

Returns `CampaignDetailResult.SuccessCampaignDetail` with `CampaignDetails` on success, or `CampaignDetailResult.Error` on failure.

#### Example

```kotlin
campaignDetailService.getCampaignDetail("12345") { result ->
    when (result) {
        is CampaignDetailResult.SuccessCampaignDetail -> {
            val detail = result.result
            
            // Use normalized display data
            val name = detail.displayCampaignName
            val description = detail.displayCampaignDescription
            val imageUrl = detail.displayFullImageUrl
            val points = detail.displayCampaignPoint
            
            // Check validation status
            val canRedeem = detail.canRedeem
            val errorMessage = detail.errorConditionMessage
            
            // Determine button type
            val buttonCatalog = detail.campaignCatalog
        }
        is CampaignDetailResult.Error -> {
            showError(result.error.message)
        }
    }
}
```

---

### redeem

Executes campaign redemption. Automatically validates selections, handles different campaign types, and returns appropriate next steps.

The SDK automatically caches the `redeemKey` internally for use with the `use()` method when needed.

```kotlin
// Suspend
suspend fun redeem(options: Map<String, String> = mapOf()): CampaignDetailResult

// Callback
fun redeem(options: Map<String, String> = mapOf(), callback: (CampaignDetailResult) -> Unit)
```

#### Response

Returns `CampaignDetailResult.SuccessRedeem` with `RedeemResponse` and `CampaignDetailNextStep` on success.

#### Example

```kotlin
campaignDetailService.redeem(mapOf()) { result ->
    when (result) {
        is CampaignDetailResult.SuccessRedeem -> {
            handleNextStep(result.campaignDetailNextStep)
        }
        is CampaignDetailResult.Error -> {
            showError(result.error.message)
        }
    }
}
```

---

### use

Activates the redemption and generates the usage code. Call this when user taps "Use Now" after receiving `CampaignDetailNextStep.ShowConfirmUse`.

Uses the cached `redeemKey` from the previous `redeem()` call. **No parameters needed** - SDK manages the redeemKey internally.

```kotlin
// Suspend
suspend fun use(): CampaignDetailResult

// Callback
fun use(callback: (CampaignDetailResult) -> Unit)
```

#### Response

Returns `CampaignDetailResult.SuccessUse` with `CampaignDetailNextStep.ShowCode` on success.

#### "Use Later" Handling

When user chooses "Use Later", **no SDK call is needed**. Simply:

1. Show success message to user
2. Navigate to redemption history screen
3. User can use the redemption later from their history

#### Example

```kotlin
when (nextStep) {
    is CampaignDetailNextStep.ShowConfirmUse -> {
        showConfirmDialog(
            onUseNow = {
                // Call use() - no parameter needed, SDK uses cached redeemKey
                campaignDetailService.use { result ->
                    when (result) {
                        is CampaignDetailResult.SuccessUse -> {
                            val showCode = result.campaignDetailNextStep as? CampaignDetailNextStep.ShowCode
                            showCodeScreen(
                                code = showCode?.code,
                                barcode = showCode?.barcode,
                                hasCountdown = showCode?.hasCountdown ?: false,
                                countdownSeconds = showCode?.countdownSeconds
                            )
                        }
                        is CampaignDetailResult.Error -> showError(result.error.message)
                    }
                }
            },
            onUseLater = {
                // No SDK call needed - just navigate to history
                showSuccessMessage("เก็บไว้ใช้ทีหลังสำเร็จ")
                navigateToHistory()
            }
        )
    }
}
```

---

### getMyPoint

Retrieves the current user's available points. Uses cache-first strategy: returns cached data if available, otherwise fetches from API and caches the result.

```kotlin
// Suspend
suspend fun getMyPoint(): Long?

// Callback
fun getMyPoint(callback: (Long?) -> Unit)
```

#### Response

Returns `Long?` - the user's available points, or `null` if not authenticated or error.

#### Caching Behavior

The SDK uses `InternalDataStore` to cache profile data:
1. First checks cached profile from `getProfileFlow()`
2. If cache exists, returns cached points immediately
3. If cache is null, fetches from API via `profileApi.profile()`
4. Saves fetched profile to cache for future use

#### Example

```kotlin
campaignDetailService.getMyPoint { points ->
    points?.let {
        updatePointsDisplay(it)
    } ?: showLoginPrompt()
}
```

---

## Campaign Types & Button Catalog

### Campaign Types

| Type | Constant | Description |
|------|----------|-------------|
| 0 | CAMPAIGN_TYPE_DRAW | Draw/Lottery campaign |
| 1 | CAMPAIGN_TYPE_FREE | Free campaign |
| 2 | CAMPAIGN_TYPE_DEAL | Deal campaign |
| 3 | CAMPAIGN_TYPE_BUY | Shopping/Purchase campaign |
| 8 | CAMPAIGN_TYPE_INTERFACE | Interface campaign |
| 9 | CAMPAIGN_TYPE_EVENT | Event campaign |
| 10 | CAMPAIGN_TYPE_MEDIA | Media campaign |
| 16 | CAMPAIGN_TYPE_NEWS | News campaign |
| 20 | CAMPAIGN_TYPE_DONATE | Donation campaign |
| 33 | CAMPAIGN_TYPE_MARKETPLACE_PRIVILEGE | Marketplace privilege |

### Button Catalog

The SDK automatically determines the appropriate button type based on campaign configuration:

```kotlin
sealed class CampaignButtonCatalog {
    object NoButton : CampaignButtonCatalog()
    data class RedeemButton(val buttonName: String) : CampaignButtonCatalog()
    data class ShoppingButton(val firstButtonName: String, val secondButtonName: String? = null) : CampaignButtonCatalog()
    data class ShoppingWithStyleButton(val firstButtonName: String, val secondButtonName: String? = null) : CampaignButtonCatalog()
    data class AddressButton(val buttonName: String) : CampaignButtonCatalog()
    data class QuantityButton(val buttonName: String) : CampaignButtonCatalog()
    data class CustomButton(val buttonName: String) : CampaignButtonCatalog()
}
```

### Button Determination Logic

| Campaign Type | Condition | Button Catalog |
|---------------|-----------|----------------|
| Event (9), Media (10), News (16) | - | `NoButton` |
| BUY (3) | Has variants | `ShoppingWithStyleButton` |
| BUY (3) | No variants | `ShoppingButton` |
| Marketplace Privilege (33) | - | `ShoppingButton` |
| Interface (8) | Survey type | `RedeemButton("Take Survey")` |
| Interface (8) | Other | `RedeemButton("Open")` |
| Draw (0) | Has delivery | `AddressButton("Draw")` |
| Draw (0) | No delivery | `RedeemButton("Draw")` |
| Donate (20) | - | `QuantityButton("Donate")` |
| Other | Has delivery | `AddressButton` |
| Other | pointType = "use" | `RedeemButton("Redeem")` |
| Other | pointType = "get" | `RedeemButton("Get Points")` |

### Handling Button Catalog

```kotlin
when (val catalog = campaignDetails.campaignCatalog) {
    is CampaignButtonCatalog.NoButton -> {
        redeemButton.visibility = View.GONE
    }
    is CampaignButtonCatalog.RedeemButton -> {
        redeemButton.text = catalog.buttonName
        redeemButton.visibility = View.VISIBLE
    }
    is CampaignButtonCatalog.ShoppingButton -> {
        redeemButton.text = catalog.firstButtonName
        catalog.secondButtonName?.let { secondaryButton.text = it }
    }
    is CampaignButtonCatalog.ShoppingWithStyleButton -> {
        showVariantSelector(campaignDetails.displayVariants ?: emptyList())
        redeemButton.text = catalog.firstButtonName
    }
    is CampaignButtonCatalog.AddressButton -> {
        showAddressSelector()
        redeemButton.text = catalog.buttonName
    }
    is CampaignButtonCatalog.QuantityButton -> {
        showQuantitySelector()
        redeemButton.text = catalog.buttonName
    }
}
```

---

## Selection Methods

### Variant Selection (BUY Campaigns)

#### selectVariant

Selects a primary variant (e.g., color, material, flavor). Clears any previous sub-variant selection.

```kotlin
fun selectVariant(variantOption: VariantOption): String?
```

Returns `null` on success, or error message string on failure.

**Validation Rules:**
- Campaign must be loaded
- Campaign type must be BUY
- Variant must have quantity > 0 (unless it has sub-variants)

#### selectSubVariant

Selects a sub-variant for the currently selected variant (e.g., size, weight). Must call `selectVariant()` first.

```kotlin
fun selectSubVariant(subVariantOption: SubVariantOption): String?
```

**Validation Rules:**
- Campaign must be loaded
- Campaign type must be BUY
- A variant must be selected first
- Sub-variant must have quantity > 0

#### getSelectedVariant / getSelectedSubVariant

```kotlin
fun getSelectedVariant(): VariantOption?
fun getSelectedSubVariant(): SubVariantOption?
```

#### clearVariantSelection

```kotlin
fun clearVariantSelection()
```

#### Example

```kotlin
// Get variants from campaign detail
val variants = campaignDetail.displayVariants ?: emptyList()

// User selects a variant
val selectedVariant = variants.first()
val error = campaignDetailService.selectVariant(selectedVariant)

if (error != null) {
    showError(error)
} else {
    // Check for sub-variants
    val subVariants = selectedVariant.subVariants
    if (!subVariants.isNullOrEmpty()) {
        showSubVariantSelector(subVariants)
    } else {
        enableRedeemButton()
    }
}
```

---

### Address Selection (Delivery Campaigns)

#### selectAddress

Selects a delivery address for campaigns requiring shipping (`delivered = true`).

```kotlin
fun selectAddress(address: Address): String?
```

**Validation Rules:**
- Campaign must be loaded
- Campaign must require delivery (`delivered = true`)
- Address must have valid `rowKey` or `id`

#### getSelectedAddress / clearAddressSelection

```kotlin
fun getSelectedAddress(): Address?
fun clearAddressSelection()
```

#### Example

```kotlin
val selectedAddress = addressList.first()
val error = campaignDetailService.selectAddress(selectedAddress)

if (error != null) {
    showError(error)
} else {
    enableRedeemButton()
}
```

---

### Quantity Management (BUY/DONATE Campaigns)

#### setQuantity

Sets the quantity for redemption. Validates against available stock and limits.

```kotlin
fun setQuantity(quantity: Int): String?
```

**Validation Rules:**
- Campaign must be loaded
- Quantity must be >= 1
- For BUY campaigns with variants: quantity <= available variant/sub-variant stock
- For DONATE campaigns: quantity <= campaign quantity limit

#### increaseQuantity / decreaseQuantity

```kotlin
fun increaseQuantity(): String?  // Returns error if exceeds limit
fun decreaseQuantity(): String?  // Returns null if already at 1
```

#### getSelectedQuantity / resetQuantity

```kotlin
fun getSelectedQuantity(): Int  // Default: 1
fun resetQuantity()
```

---

### clearAllSelections

Clears all selections (variant, sub-variant, address, cached redeemKey) and resets quantity to 1.

```kotlin
fun clearAllSelections()
```

**Note:** This is automatically called when loading a new campaign via `getCampaignDetail()`.

---

## Validation & Error Handling

### SDK Auto-Validation

The SDK automatically validates campaign conditions when calling `getCampaignDetail()`:

1. **Authentication** - User must be authenticated (not device login)
2. **Points Check** - User points vs required points (skipped for BUY and MARKETPLACE_PRIVILEGE)
3. **Expiration** - Campaign must not be expired (using server time)
4. **Stock** - Available quantity must be > 0 (`qty > 0`)
5. **Item Limits** - Item count vs quantity limits (`itemCountSold < quantity`)
6. **Condition Pass** - User must meet all eligibility conditions (`isConditionPass`)

Results are stored in:

- `canRedeem: Boolean` - Campaign is ready for redemption
- `errorConditionMessage: String?` - Error message if not ready

### Condition Alert Codes

| Alert ID | Description | Config Field |
|----------|-------------|--------------|
| 1 | Campaign sold out | alertSoldOut |
| 2 | Max redemption per person reached | alertMaxRedemption |
| 3 | Campaign in cool down period | alertCoolDown |
| 1403 | Condition invalid | alertConditionInvalid |
| 1406 | Sponsor only campaign | alertSponsorOnly |
| 1409 | Campaign expired | alertExpired |
| 1410 | Campaign not started yet | alertNotStarted |
| 1416 | App version expired | alertAppVersionExpired |
| 1427 | Terms and conditions not met | alertTermsConditions |

### Error Codes from Redeem

| Code | Description | When |
|------|-------------|------|
| -2 | Token required | User not authenticated |
| -99 | Invalid campaign type | Cart operation on unsupported type |
| -100 | Invalid variant | Variant validation failed |
| -101 | Invalid quantity | Quantity validation failed |
| -102 | Address required | Delivery campaign without address |
| -104 | Redeem key not found | Calling `use()` without prior `redeem()` |

### Handling Validation

```kotlin
val result = campaignDetailService.getCampaignDetail("12345")

when (result) {
    is CampaignDetailResult.SuccessCampaignDetail -> {
        val detail = result.result
        
        if (detail.canRedeem == true) {
            // Ready to redeem
            enableRedeemButton()
        } else {
            // Handle specific error
            handleValidationError(detail.errorConditionMessage)
        }
    }
    is CampaignDetailResult.Error -> {
        showError(result.error.message)
    }
}

fun handleValidationError(message: String?) {
    when {
        message?.contains("Not Authenticated") == true -> showLoginPrompt()
        message?.contains("Insufficient points") == true -> showInsufficientPointsDialog()
        message?.contains("expired") == true -> showExpiredMessage()
        message?.contains("sold out") == true -> showSoldOutMessage()
        else -> showError(message ?: "Campaign not available")
    }
}
```

---

## Redemption Flow Logic

### CampaignDetailNextStep - Post-Redemption Flow

After successful redemption, handle the `CampaignDetailNextStep` to show appropriate UI:

```kotlin
sealed class CampaignDetailNextStep {

    /** Item added to shopping cart successfully. */
    data class ShowAddToCartSuccess(
        val cartUrl: String? = null
    ) : CampaignDetailNextStep()

    /** Show redemption code to user. */
    data class ShowCode(
        val code: String,
        val barcode: String?,
        val hasCountdown: Boolean,
        val countdownSeconds: Long?,
        val redeemDate: Long?
    ) : CampaignDetailNextStep()

    /** Show confirm use dialog - ask user to use now or later. */
    data class ShowConfirmUse(
        val redeemKey: String,
        val campaignId: String
    ) : CampaignDetailNextStep()

    /**
     * Redeem success - show information screen.
     * Used for delivery campaigns, draw/donate campaigns, get points campaigns, etc.
     */
    data class ShowInformation(
        val campaignDetail: CampaignDetails
    ) : CampaignDetailNextStep()

    /** Open website URL in browser or custom tabs. */
    data class OpenWebsite(
        val url: String,
        val urlType: String   // "survey", "website", or "media"
    ) : CampaignDetailNextStep()
}
```

### Detailed Redemption Flow Logic

The SDK determines the next step based on campaign configuration and response:

#### For Delivery Campaigns (delivered = true)

```
redeem() → ShowInformation(campaignDetails)
```
Delivery campaigns always return `ShowInformation` directly, skipping all other logic.

#### For DRAW and DONATE Campaigns

```
redeem() → ShowInformation(campaignDetails)
```

#### For GET Points Campaigns (pointType = GET)

```
redeem() → ShowInformation(campaignDetails)
```

#### For BUY / MARKETPLACE_PRIVILEGE Campaigns

```
redeem() → ShowAddToCartSuccess(cartUrl)
```

#### For INTERFACE / MEDIA / NEWS Campaigns

```
redeem() → OpenWebsite(url, urlType)
```

#### For Standard Redemptions (4-Case Logic)

The SDK uses a combination of `isNotAutoUse` and `isRequireUniqueSerial` flags:

| Case | isNotAutoUse | isRequireUniqueSerial | isUsed | Result |
|------|--------------|----------------------|--------|--------|
| 1.1 | `true` | `true` | - | `ShowCode` directly |
| 1.2 | `true` | `false` | - | `ShowConfirmUse` |
| 2.1 | `false` | - | `true` | `ShowCode` directly |
| 2.2 | `false` | - | `false` | `ShowConfirmUse` |

**Explanation:**
- **Case 1 (isNotAutoUse = true)**: Campaign configured to NOT auto-use
  - **1.1**: Requires unique serial → Show code immediately
  - **1.2**: No unique serial required → Ask user "Use Now / Use Later"
- **Case 2 (isNotAutoUse = false)**: Campaign configured to auto-use
  - **2.1**: Already used by server → Show code immediately
  - **2.2**: Not yet used → Ask user "Use Now / Use Later"

```kotlin
// Implementation logic
val isNotAutoUse = campaign.isNotAutoUse ?: false
val isRequireUniqueSerial = campaign.isRequireUniqueSerial ?: false
val isUsed = response.isUsed ?: false

return when {
    isNotAutoUse && isRequireUniqueSerial -> CampaignDetailNextStep.ShowCode(...)
    isNotAutoUse -> CampaignDetailNextStep.ShowConfirmUse(...)
    isUsed -> CampaignDetailNextStep.ShowCode(...)
    else -> CampaignDetailNextStep.ShowConfirmUse(...)
}
```

#### ShowCode Details

When `ShowCode` is returned, it includes:
- `code` - The redemption code (redeemKey)
- `barcode` - The serial/barcode value
- `hasCountdown` - Whether a countdown timer should be shown (`minutesValidAfterUsed > 0`)
- `countdownSeconds` - Countdown duration in seconds (null if no countdown)
- `redeemDate` - The redeem date timestamp

### Flow Diagram

```
redeem()
├── Delivery Campaign (delivered = true)
│   └── ShowInformation(campaignDetails)
│
├── DRAW (0) / DONATE (20) Campaign
│   └── ShowInformation(campaignDetails)
│
├── pointType = GET
│   └── ShowInformation(campaignDetails)
│
├── BUY (3) / MARKETPLACE_PRIVILEGE (33) Campaign
│   └── ShowAddToCartSuccess(cartUrl)
│
├── INTERFACE (8) / MEDIA (10) / NEWS (16) Campaign
│   └── OpenWebsite(url, urlType)
│
└── Standard Campaign
    ├── isNotAutoUse = true
    │   ├── isRequireUniqueSerial = true  → ShowCode
    │   └── isRequireUniqueSerial = false → ShowConfirmUse
    │       ├── "Use Now"  → use() → ShowCode
    │       └── "Use Later" → Navigate to history
    │
    └── isNotAutoUse = false
        ├── isUsed = true  → ShowCode
        └── isUsed = false → ShowConfirmUse
            ├── "Use Now"  → use() → ShowCode
            └── "Use Later" → Navigate to history
```

---

## Complete Flow Examples

### BUY Campaign with Variants

```kotlin
class BuyCampaignViewModel {
    private val campaignDetail = BuzzebeesSDK.instance().campaignDetailUseCase
    
    fun loadCampaign(campaignId: String) {
        campaignDetail.getCampaignDetail(campaignId) { result ->
            when (result) {
                is CampaignDetailResult.SuccessCampaignDetail -> {
                    val detail = result.result
                    
                    if (detail.campaignCatalog is CampaignButtonCatalog.ShoppingWithStyleButton) {
                        showVariants(detail.displayVariants ?: emptyList())
                    }
                }
                is CampaignDetailResult.Error -> handleError(result.error)
            }
        }
    }
    
    fun onVariantSelected(variant: VariantOption) {
        val error = campaignDetail.selectVariant(variant)
        if (error != null) {
            showError(error)
            return
        }
        
        val subVariants = variant.subVariants
        if (!subVariants.isNullOrEmpty()) {
            showSubVariants(subVariants)
        } else {
            enableAddToCart()
        }
    }
    
    fun onSubVariantSelected(subVariant: SubVariantOption) {
        val error = campaignDetail.selectSubVariant(subVariant)
        if (error != null) {
            showError(error)
            return
        }
        enableAddToCart()
    }
    
    fun onQuantityChanged(qty: Int) {
        val error = campaignDetail.setQuantity(qty)
        error?.let { showError(it) }
    }
    
    fun addToCart() {
        campaignDetail.redeem(mapOf()) { result ->
            when (result) {
                is CampaignDetailResult.SuccessRedeem -> {
                    val nextStep = result.campaignDetailNextStep
                    if (nextStep is CampaignDetailNextStep.ShowAddToCartSuccess) {
                        showCartSuccess(nextStep.cartUrl)
                    }
                }
                is CampaignDetailResult.Error -> handleError(result.error)
            }
        }
    }
}
```

---

### DONATE Campaign with Quantity

```kotlin
class DonateCampaignViewModel {
    private val campaignDetail = BuzzebeesSDK.instance().campaignDetailUseCase
    
    fun loadCampaign(campaignId: String) {
        campaignDetail.getCampaignDetail(campaignId) { result ->
            when (result) {
                is CampaignDetailResult.SuccessCampaignDetail -> {
                    val detail = result.result
                    
                    if (detail.campaignCatalog is CampaignButtonCatalog.QuantityButton) {
                        showQuantitySelector()
                    }
                }
                is CampaignDetailResult.Error -> handleError(result.error)
            }
        }
    }
    
    fun onIncreaseQuantity() {
        val error = campaignDetail.increaseQuantity()
        error?.let { showError(it) }
        updateQuantityDisplay(campaignDetail.getSelectedQuantity())
    }
    
    fun onDecreaseQuantity() {
        campaignDetail.decreaseQuantity()
        updateQuantityDisplay(campaignDetail.getSelectedQuantity())
    }
    
    fun donate() {
        campaignDetail.redeem(mapOf()) { result ->
            when (result) {
                is CampaignDetailResult.SuccessRedeem -> {
                    val nextStep = result.campaignDetailNextStep
                    if (nextStep is CampaignDetailNextStep.ShowInformation) {
                        showDonateSuccess(nextStep.campaignDetail)
                    }
                }
                is CampaignDetailResult.Error -> handleError(result.error)
            }
        }
    }
}
```

---

### Campaign with Delivery Address

```kotlin
class DeliveryCampaignViewModel {
    private val campaignDetail = BuzzebeesSDK.instance().campaignDetailUseCase
    
    fun loadCampaign(campaignId: String) {
        campaignDetail.getCampaignDetail(campaignId) { result ->
            when (result) {
                is CampaignDetailResult.SuccessCampaignDetail -> {
                    val detail = result.result
                    
                    if (detail.campaignCatalog is CampaignButtonCatalog.AddressButton) {
                        loadUserAddresses()
                    }
                }
                is CampaignDetailResult.Error -> handleError(result.error)
            }
        }
    }
    
    fun onAddressSelected(address: Address) {
        val error = campaignDetail.selectAddress(address)
        if (error != null) {
            showError(error)
            return
        }
        enableRedeemButton()
    }
    
    fun redeem() {
        campaignDetail.redeem(mapOf()) { result ->
            when (result) {
                is CampaignDetailResult.SuccessRedeem -> {
                    handleNextStep(result.campaignDetailNextStep)
                }
                is CampaignDetailResult.Error -> handleError(result.error)
            }
        }
    }
}
```

---

### Complete NextStep Handler

```kotlin
fun handleNextStep(nextStep: CampaignDetailNextStep?) {
    when (nextStep) {
        is CampaignDetailNextStep.ShowCode -> {
            showRedemptionCode(
                code = nextStep.code,
                barcode = nextStep.barcode,
                hasCountdown = nextStep.hasCountdown,
                countdownSeconds = nextStep.countdownSeconds,
                redeemDate = nextStep.redeemDate
            )
        }
        is CampaignDetailNextStep.ShowConfirmUse -> {
            // Show dialog for Use Now / Use Later
            showConfirmUseDialog(
                onUseNow = {
                    campaignDetailService.use { result ->
                        when (result) {
                            is CampaignDetailResult.SuccessUse -> {
                                val showCode = result.campaignDetailNextStep as? CampaignDetailNextStep.ShowCode
                                showCode?.let {
                                    showRedemptionCode(
                                        code = it.code,
                                        barcode = it.barcode,
                                        hasCountdown = it.hasCountdown,
                                        countdownSeconds = it.countdownSeconds,
                                        redeemDate = it.redeemDate
                                    )
                                }
                            }
                            is CampaignDetailResult.Error -> showError(result.error.message)
                        }
                    }
                },
                onUseLater = {
                    // No SDK call needed
                    showSuccessMessage("เก็บไว้ใช้ทีหลังสำเร็จ")
                    navigateToHistory()
                }
            )
        }
        is CampaignDetailNextStep.ShowInformation -> {
            // Used for delivery, draw, donate, and get-points campaigns
            showInformationScreen(nextStep.campaignDetail)
        }
        is CampaignDetailNextStep.ShowAddToCartSuccess -> {
            showCartSuccess()
            nextStep.cartUrl?.let { openCart(it) }
        }
        is CampaignDetailNextStep.OpenWebsite -> {
            openWebView(nextStep.url, nextStep.urlType)
        }
        null -> {
            showSuccessMessage("Redemption successful!")
        }
    }
}
```

---

## Entity Reference

### CampaignDetails

#### SDK-Calculated Fields

| Field | Type | Description |
|-------|------|-------------|
| canRedeem | Boolean | Ready for redemption |
| errorConditionMessage | String? | Error message if not ready |
| campaignCatalog | CampaignButtonCatalog | Button type to display |
| displayCampaignName | String | Normalized name |
| displayCampaignDescription | String | Normalized description |
| displayConditions | String | Normalized conditions |
| displayFullImageUrl | String? | Normalized image URL |
| displayPictures | `List<String>` | Normalized pictures |
| displayCampaignPoint | String | Formatted points display |
| displayVariants | `ArrayList<VariantOption>?` | Normalized variants |

#### Key Campaign Fields

| Field | Type | Description |
|-------|------|-------------|
| id | Int? | Campaign ID |
| name | String? | Campaign name |
| type | Int? | Campaign type constant |
| pointType | Int? | Point type (USE=1, GET=2) |
| pointPerUnit | Double? | Points required/earned |
| qty | Double? | Available quantity |
| delivered | Boolean? | Requires delivery address |
| isNotAutoUse | Boolean? | Not auto-use flag |
| isRequireUniqueSerial | Boolean? | Requires unique serial |
| isConditionPass | Boolean? | User meets conditions |
| conditionAlertId | String? | Condition alert code |
| conditionAlert | String? | Condition alert message |

---

### CampaignDetailResult

```kotlin
sealed class CampaignDetailResult {
    data class SuccessCampaignDetail(
        val result: CampaignDetails
    ) : CampaignDetailResult()
    
    data class SuccessRedeem(
        val result: RedeemResponse, 
        var campaignDetailNextStep: CampaignDetailNextStep? = null
    ) : CampaignDetailResult()
    
    data class SuccessUse(
        val result: RedeemResponse, 
        var campaignDetailNextStep: CampaignDetailNextStep? = null
    ) : CampaignDetailResult()
    
    data class Error(
        val error: ErrorResponse
    ) : CampaignDetailResult()
}
```

---

### CampaignDetailNextStep

```kotlin
sealed class CampaignDetailNextStep {
    data class ShowAddToCartSuccess(val cartUrl: String? = null) : CampaignDetailNextStep()
    data class ShowCode(val code: String, val barcode: String?, val hasCountdown: Boolean, val countdownSeconds: Long?, val redeemDate: Long?) : CampaignDetailNextStep()
    data class ShowConfirmUse(val redeemKey: String, val campaignId: String) : CampaignDetailNextStep()
    data class ShowInformation(val campaignDetail: CampaignDetails) : CampaignDetailNextStep()
    data class OpenWebsite(val url: String, val urlType: String) : CampaignDetailNextStep()
}
```

---

### VariantOption

| Field | Type | Description |
|-------|------|-------------|
| campaignId | String? | Campaign ID for variant |
| name | String? | Display name |
| value | String? | Value |
| price | Double? | Price |
| points | Double? | Points required |
| quantity | Int? | Available quantity |
| subVariants | `ArrayList<SubVariantOption>?` | Sub-variants |

---

### SubVariantOption

| Field | Type | Description |
|-------|------|-------------|
| campaignId | String? | Campaign ID |
| name | String? | Display name |
| value | String? | Value |
| type | String? | Sub-variant type |
| price | Double? | Price |
| points | Double? | Points required |
| quantity | Int? | Available quantity |

---

### RedeemResponse

| Field | Type | Description |
|-------|------|-------------|
| campaignId | Int? | Campaign ID |
| redeemKey | String? | Redemption key |
| serial | String? | Serial/code |
| isUsed | Boolean? | Whether already used |
| pointPerUnit | Double? | Points earned |

---

## Related Documentation

- [SDK Comprehensive Guide](./SDK_COMPREHENSIVE_GUIDE.md) - Complete overview of all SDK capabilities
- [CampaignUseCase Guide](./CampaignUseCase_GUIDE.md) - Campaign list operations
- [HistoryUseCase Guide](./HistoryUseCase_GUIDE.md) - Redemption history operations

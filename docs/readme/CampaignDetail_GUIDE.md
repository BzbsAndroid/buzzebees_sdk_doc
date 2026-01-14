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
8. [Complete Flow Examples](#complete-flow-examples)
9. [Entity Reference](#entity-reference)

---

## Overview

The `CampaignDetailUseCase` provides complete campaign detail management including:

- Campaign detail retrieval with automatic validation
- Variant/sub-variant selection for BUY campaigns
- Address selection for delivery campaigns
- Quantity management for BUY/DONATE campaigns
- Unified redemption flow with next step guidance
- Points query with caching
- Localization support via `setDisplayTexts()`

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
// 1. Set display texts once at initialization
campaignDetailService.setDisplayTexts(CampaignDetailExtractorConfig.THAI)

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

### setDisplayTexts

Set display texts configuration once at initialization. All button names, error messages, and condition alerts will use these texts automatically.

```kotlin
fun setDisplayTexts(config: CampaignDetailExtractorConfig)
fun getDisplayTexts(): CampaignDetailExtractorConfig
```

### Available Presets

```kotlin
CampaignDetailExtractorConfig.DEFAULT  // English
CampaignDetailExtractorConfig.THAI     // Thai
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
| errorInsufficientPoints | "Insufficient points..." | "แต้มไม่เพียงพอ..." |
| errorCampaignExpired | "Campaign Expired" | "แคมเปญหมดอายุ" |
| errorCampaignSoldOut | "Campaign sold out" | "สินค้าหมด" |
| errorCampaignNotLoaded | "Campaign not loaded" | "ไม่พบข้อมูลแคมเปญ" |
| errorVariantOnlyForBuy | "Variant selection only..." | "เลือกตัวเลือกได้เฉพาะ..." |
| errorVariantOutOfStock | "Selected variant is out of stock" | "ตัวเลือกที่เลือกหมด" |
| errorSubVariantOutOfStock | "Selected sub-variant is out of stock" | "ตัวเลือกย่อยที่เลือกหมด" |
| errorSelectVariantFirst | "Please select a variant first" | "กรุณาเลือกตัวเลือกหลักก่อน" |
| errorQuantityMinimum | "Quantity must be at least 1" | "จำนวนต้องมากกว่า 0" |
| errorOnlyXAvailable | "Only %d available" | "เหลือเพียง %d ชิ้น" |
| errorMaxDonateAllowed | "Maximum %d donate allowed" | "บริจาคได้สูงสุด %d" |
| errorSelectAddress | "Please select a delivery address" | "กรุณาเลือกที่อยู่จัดส่ง" |
| errorSelectVariant | "Please select a variant" | "กรุณาเลือกตัวเลือก" |
| errorSelectSubVariant | "Please select a sub-variant" | "กรุณาเลือกตัวเลือกย่อย" |
| errorTokenRequired | "Token is required" | "กรุณาเข้าสู่ระบบ" |
| errorAddToCartFailed | "Failed to add to cart" | "เพิ่มในตะกร้าไม่สำเร็จ" |
| errorRedeemKeyNotFound | "Redeem key not found. Please redeem first." | "ไม่พบรหัสแลก กรุณาแลกสิทธิ์ก่อน" |

### Helper Functions

```kotlin
// Format insufficient points error
config.formatInsufficientPoints(required = 500L, available = 100L)
// → "แต้มไม่เพียงพอ ต้องการ: 500, มี: 100"

// Format only X available error
config.formatOnlyXAvailable(available = 5)
// → "เหลือเพียง 5 ชิ้น"

// Format max donate allowed error
config.formatMaxDonateAllowed(max = 10)
// → "บริจาคได้สูงสุด 10"
```

### Usage Examples

```kotlin
// Option 1: Use Thai language
campaignDetailService.setDisplayTexts(CampaignDetailExtractorConfig.THAI)

// Option 2: Use English (default)
campaignDetailService.setDisplayTexts(CampaignDetailExtractorConfig.DEFAULT)

// Option 3: Custom some texts
campaignDetailService.setDisplayTexts(
    CampaignDetailExtractorConfig.THAI.copy(
        buttonRedeem = "แลกสิทธิ์",
        buttonShopNow = "ช้อปเลย",
        errorCampaignSoldOut = "สินค้าหมดแล้วจ้า"
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
        BuzzebeesSDK.instance().campaignDetailUseCase.setDisplayTexts(
            CampaignDetailExtractorConfig.THAI
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
| options | Additional options | No | `Map<String, String>` |

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

When `isAutoUse = false` (configured in buzzebees-service.json), successful redemption returns `NextStep.ShowConfirmUse`. The SDK automatically caches the `redeemKey` for use with the `use()` method.

```kotlin
// Suspend
suspend fun redeem(options: Map<String, String> = mapOf()): CampaignDetailResult

// Callback
fun redeem(options: Map<String, String> = mapOf(), callback: (CampaignDetailResult) -> Unit)
```

#### Response

Returns `CampaignDetailResult.SuccessRedeem` with `RedeemResponse` and `NextStep` on success.

#### Example

```kotlin
campaignDetailService.redeem(mapOf()) { result ->
    when (result) {
        is CampaignDetailResult.SuccessRedeem -> {
            handleNextStep(result.nextStep)
        }
        is CampaignDetailResult.Error -> {
            showError(result.error.message)
        }
    }
}
```

---

### use

Activates the redemption and generates the usage code. Call this when user taps "Use Now" after receiving `NextStep.ShowConfirmUse`.

Uses the cached `redeemKey` from the previous `redeem()` call. **No parameters needed** - SDK manages the redeemKey internally.

```kotlin
// Suspend
suspend fun use(): CampaignDetailResult

// Callback
fun use(callback: (CampaignDetailResult) -> Unit)
```

#### Response

Returns `CampaignDetailResult.SuccessUse` with `NextStep.ShowCode` on success.

#### "Use Later" Handling

When user chooses "Use Later", **no SDK call is needed**. Simply:

1. Show success message to user
2. Navigate to redemption history screen
3. User can use the redemption later from their history

#### Example

```kotlin
when (nextStep) {
    is NextStep.ShowConfirmUse -> {
        showConfirmDialog(
            onUseNow = {
                // Call use() - no parameter needed, SDK uses cached redeemKey
                campaignDetailService.use { result ->
                    when (result) {
                        is CampaignDetailResult.SuccessUse -> {
                            val showCode = result.nextStep as? NextStep.ShowCode
                            showCodeScreen(showCode?.code)
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

Retrieves the current user's available points. Returns cached data if available, otherwise fetches from API.

```kotlin
// Suspend
suspend fun getMyPoint(): Long?

// Callback
fun getMyPoint(callback: (Long?) -> Unit)
```

#### Response

Returns `Long?` - the user's available points, or `null` if not authenticated or error.

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

#### selectSubVariant

Selects a sub-variant for the currently selected variant (e.g., size, weight). Must call `selectVariant()` first.

```kotlin
fun selectSubVariant(subVariantOption: SubVariantOption): String?
```

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

---

## Validation & Error Handling

### SDK Auto-Validation

The SDK automatically validates campaign conditions when calling `getCampaignDetail()`:

1. User authentication status (not device login)
2. User points vs required points
3. Campaign expiration using server time
4. Available quantity (`qty > 0`)
5. Item count vs quantity limits (`itemCountSold < quantity`)
6. User eligibility and condition pass status
7. All condition alerts and business rules

Results are stored in:

- `canRedeem: Boolean` - Campaign is ready for redemption
- `errorConditionMessage: String?` - Error message if not ready

### Condition Alert Codes

| Alert ID | Description | Error Type |
|----------|-------------|------------|
| 1 | Campaign sold out | SOLD_OUT |
| 2 | Max redemption per person reached | MAX_PER_PERSON |
| 3 | Campaign in cool down period | COOL_DOWN |
| 1403 | Condition invalid | CONDITION_INVALID |
| 1406 | Sponsor only campaign | SPONSOR_ONLY |
| 1409 | Campaign expired | EXPIRED |
| 1410 | Campaign not started yet | CAMPAIGN_PENDING |
| 1416 | App version expired | VERSION_EXPIRED |
| 1427 | Terms and conditions not met | TERMS_VIOLATION |

### Error Codes from Redeem

| Code | Description |
|------|-------------|
| -2 | Token required |
| -99 | Invalid campaign type for cart |
| -100 | Invalid variant |
| -101 | Invalid quantity |
| -102 | Address required |
| -104 | Redeem key not found (call redeem() first) |

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

## Complete Flow Examples

### NextStep - Post-Redemption Flow

After successful redemption, handle the `NextStep` to show appropriate UI:

```kotlin
sealed class NextStep {
    data class ShowCode(val redeemKey: String, val code: String, val campaignId: String) : NextStep()
    data class ShowConfirmUse(val redeemKey: String, val campaignId: String) : NextStep()
    data class ShowRedeemSuccess(val redeemKey: String, val campaignId: String) : NextStep()
    data class ShowPointsEarned(val redeemKey: String, val pointsEarned: Double, val campaignId: String) : NextStep()
    data class ShowDrawSuccess(val redeemKey: String, val campaignId: String, val code: String?, val pointsEarned: Double?) : NextStep()
    data class ShowAddToCartSuccess(val cartUrl: String?) : NextStep()
    data class SelectDeliveryAddress(val campaignId: String, val redeemKey: String) : NextStep()
    data class OpenWebsite(val url: String, val urlType: String) : NextStep()
    data class Error(val redeemKey: String?, val errorMessage: String, val campaignId: String) : NextStep()
    object Complete : NextStep()
}
```

### isAutoUse Flow

`IsAutoUse` is configured in `buzzebees-service.json`:

- **`IsAutoUse: true`** (default): Server auto-generates code → `NextStep.ShowCode`
- **`IsAutoUse: false`**: User must confirm → `NextStep.ShowConfirmUse`

```
redeem() → SuccessRedeem
├── isAutoUse = true  → NextStep.ShowCode → Display code
└── isAutoUse = false → NextStep.ShowConfirmUse → Dialog
    ├── "Use Now"   → use() → SuccessUse → ShowCode
    └── "Use Later" → No SDK call → Navigate to history
```

---

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
                    if (result.nextStep is NextStep.ShowAddToCartSuccess) {
                        showCartSuccess(result.nextStep.cartUrl)
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
                    if (result.nextStep is NextStep.ShowDrawSuccess) {
                        showDonateSuccess()
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
                    handleRedeemSuccess(result.nextStep)
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
fun handleNextStep(nextStep: NextStep?) {
    when (nextStep) {
        is NextStep.ShowCode -> {
            showRedemptionCode(nextStep.code, nextStep.redeemKey)
        }
        is NextStep.ShowConfirmUse -> {
            // Show dialog for Use Now / Use Later
            showConfirmUseDialog(
                onUseNow = {
                    campaignDetailService.use { result ->
                        when (result) {
                            is CampaignDetailResult.SuccessUse -> {
                                val code = (result.nextStep as? NextStep.ShowCode)?.code
                                showCodeScreen(code)
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
        is NextStep.ShowRedeemSuccess -> {
            showSuccessScreen(nextStep.redeemKey)
        }
        is NextStep.ShowPointsEarned -> {
            showPointsEarnedDialog(nextStep.pointsEarned)
        }
        is NextStep.ShowDrawSuccess -> {
            showDrawSuccessDialog(nextStep.code, nextStep.pointsEarned)
        }
        is NextStep.ShowAddToCartSuccess -> {
            showCartSuccess()
            nextStep.cartUrl?.let { openCart(it) }
        }
        is NextStep.SelectDeliveryAddress -> {
            showAddressSelector(nextStep.redeemKey)
        }
        is NextStep.OpenWebsite -> {
            openWebView(nextStep.url, nextStep.urlType)
        }
        is NextStep.Error -> {
            showError(nextStep.errorMessage)
        }
        NextStep.Complete, null -> {
            showSuccessMessage("Redemption successful!")
        }
    }
}
```

---

## Entity Reference

### CampaignDetails

#### Server Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | Int? | Campaign identifier |
| agencyID | Int? | Agency identifier |
| agencyName | String? | Agency display name |
| name | String? | Campaign display name |
| detail | String? | Detailed description |
| condition | String? | Terms and conditions |
| conditionAlert | String? | Condition alert message |
| categoryID | Int? | Category identifier |
| categoryName | String? | Category display name |
| startDate | Long? | Start timestamp |
| currentDate | Long? | Server timestamp |
| expireDate | Long? | Expiration timestamp |
| location | String? | Location information |
| website | String? | Website URL |
| discount | Double? | Discount amount |
| originalPrice | Double? | Original price |
| pricePerUnit | Double? | Price per unit |
| pointPerUnit | Double? | Points per unit |
| quantity | Double? | Total quantity |
| qty | Double? | Available quantity |
| redeemMostPerPerson | Double? | Max per person |
| peopleLike | Int? | Like count |
| peopleDislike | Int? | Dislike count |
| itemCountSold | Double? | Items sold |
| delivered | Boolean? | Requires delivery |
| buzz | Int? | Buzz score |
| type | Int? | Campaign type |
| isSponsor | Boolean? | Is sponsored |
| dayRemain | Int? | Days remaining |
| dayProceed | Int? | Days since start |
| soldOutDate | Long? | Sold out date |
| caption | String? | Caption/subtitle |
| voucherExpireDate | Long? | Voucher expiration |
| userLevel | Long? | Required user level |
| redeemCount | Int? | Redemption count |
| useCount | Int? | Usage count |
| nextRedeemDate | Long? | Next redeem date |
| isLike | Boolean? | User liked |
| minutesValidAfterUsed | Int? | Minutes valid |
| barcode | String? | Barcode |
| customInput | String? | Custom input |
| customCaption | String? | Custom caption |
| interfaceDisplay | String? | Interface config |
| pointType | String? | Point type (use/get) |
| defaultPrivilegeMessage | String? | Privilege message |
| isNotAutoUse | Boolean? | Not auto-use flag |
| pictures | `List<Picture>?` | Image gallery |
| isConditionPass | Boolean? | Condition passed |
| conditionAlertId | Int? | Alert identifier |
| fullImageUrl | String? | Full image URL |
| subCampaignStyles | SubCampaignStyle? | Style config |
| subCampaigns | `List<SubCampaign>?` | Sub-campaigns |
| related | `List<Campaign>?` | Related campaigns |
| isFavourite | Boolean? | Is favorite |
| partialPoints | PartialDetailPoints? | Partial points |

#### SDK-Calculated Fields

| Field | Type | Description |
|-------|------|-------------|
| canRedeem | Boolean | Ready for redemption |
| errorConditionMessage | String? | Error message if not ready |
| campaignCatalog | CampaignButtonCatalog | Button type to display |
| displayCampaignName | String? | Normalized name |
| displayCampaignDescription | String? | Normalized description |
| displayConditions | String? | Normalized conditions |
| displayFullImageUrl | String? | Normalized image URL |
| displayPictures | `List<String>?` | Normalized pictures |
| displayCampaignPoint | String? | Formatted points |
| displayVariants | `ArrayList<VariantOption>?` | Normalized variants |

---

### RedeemResponse

| Field | Type | Description |
|-------|------|-------------|
| campaignId | Int? | Campaign identifier |
| itemNumber | Int? | Item number |
| serial | String? | Serial/code |
| agencyId | Int? | Agency identifier |
| agencyName | String? | Agency name |
| name | String? | Redemption name |
| nextRedeemDate | Long? | Next redeem date |
| currentDate | Long? | Server timestamp |
| redeemCount | Int? | Redemption count |
| useCount | Int? | Usage count |
| qty | Double? | Available quantity |
| isConditionPass | Boolean? | Condition passed |
| conditionAlert | String? | Condition alert |
| isNotAutoUse | Boolean? | Not auto-use |
| pointType | String? | Point type |
| interfaceDisplay | String? | Interface config |
| redeemKey | String? | Redemption key |
| pricePerUnit | Double? | Price per unit |
| redeemDate | Long? | Redemption timestamp |
| campaignName | String? | Campaign name |
| pointPerUnit | Double? | Points per unit |
| expireIn | Long? | Expiration period |
| privilegeMessage | String? | Privilege message |
| privilegeMessageEN | String? | English message |

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

### CampaignDetailResult

```kotlin
sealed class CampaignDetailResult {
    data class SuccessCampaignDetail(val result: CampaignDetails) : CampaignDetailResult()
    data class SuccessRedeem(val result: RedeemResponse, var nextStep: NextStep?) : CampaignDetailResult()
    data class SuccessUse(val result: RedeemResponse, var nextStep: NextStep?) : CampaignDetailResult()
    data class SuccessUseLater(var nextStep: NextStep?) : CampaignDetailResult()
    data class Error(val error: ErrorResponse) : CampaignDetailResult()
    data class SuccessMarketplacePrivilege(
        val campaignDetail: CampaignDetails,
        val maximumPartialPoints: Double?,
        val maximumPartialPrice: Double?,
        val redirectUrl: String
    ) : CampaignDetailResult()
}
```

---

### Address

| Field | Type | Description |
|-------|------|-------------|
| rowKey | String? | Address identifier |
| id | String? | Address ID |
| contactNumber | String? | Contact phone |
| name | String? | Recipient name |
| address | String? | Full address |
| province | String? | Province |
| district | String? | District |
| subDistrict | String? | Sub-district |
| postalCode | String? | Postal code |

---

## Related Documentation

- [SDK Comprehensive Guide](./SDK_COMPREHENSIVE_GUIDE.md) - Complete overview of all SDK capabilities
- [CampaignUseCase Guide](./CampaignUseCase_GUIDE.md) - Campaign list operations

## CampaignDetailUseCase Guide

This guide shows how to initialize and use every public method in `CampaignDetailUseCase`, with suspend and callback examples where available. The CampaignDetailUseCase handles campaign detail retrieval, variant/sub-variant selection for BUY campaigns, address selection for delivery campaigns, quantity management, and redemption operations.

### Getting an instance

```kotlin
val campaignDetailService = BuzzebeesSDK.instance().campaignDetailUseCase
```

---

## Quick Start

```kotlin
// 1. Set display texts once at initialization
campaignDetailService.setDisplayTexts(CampaignDetailExtractorConfig.THAI)

// 2. Use methods without worrying about localization
val result = campaignDetailService.getCampaignDetail(id = "12345")
val redeemResult = campaignDetailService.redeem(mapOf())
```

---

## setDisplayTexts

Set display texts configuration once at initialization. After setting, all button names, error messages, and condition alerts will use these texts automatically.

### Method Signature

```kotlin
fun setDisplayTexts(config: CampaignDetailExtractorConfig)
fun getDisplayTexts(): CampaignDetailExtractorConfig
```

### CampaignDetailExtractorConfig Fields

| Category | Field | Default (English) | Thai |
|----------|-------|-------------------|------|
| **Button Names** | buttonShopNow | "Shop Now" | "ซื้อเลย" |
| | buttonAddToCart | "Add to Cart" | "เพิ่มในตะกร้า" |
| | buttonTakeSurvey | "Take Survey" | "ทำแบบสอบถาม" |
| | buttonOpen | "Open" | "เปิด" |
| | buttonDraw | "Draw" | "จับรางวัล" |
| | buttonDonate | "Donate" | "บริจาค" |
| | buttonRedeem | "Redeem" | "แลก" |
| | buttonGetPoints | "Get Points" | "รับแต้ม" |
| **Condition Alerts** | alertSoldOut | "Campaign sold out" | "สินค้าหมด" |
| | alertMaxRedemption | "Max redemption per person reached" | "แลกครบจำนวนสูงสุดต่อคนแล้ว" |
| | alertCoolDown | "Campaign in cool down period" | "อยู่ในช่วงพักการแลก" |
| | alertConditionInvalid | "Condition invalid" | "เงื่อนไขไม่ถูกต้อง" |
| | alertSponsorOnly | "Sponsor only campaign" | "สำหรับสปอนเซอร์เท่านั้น" |
| | alertExpired | "Campaign expired" | "แคมเปญหมดอายุ" |
| | alertNotStarted | "Campaign not started yet" | "แคมเปญยังไม่เริ่ม" |
| | alertAppVersionExpired | "App version expired" | "กรุณาอัปเดตแอป" |
| | alertTermsConditions | "This privilege cannot be redeemed..." | "ไม่สามารถแลกได้ตามเงื่อนไขที่กำหนด" |
| | alertUnknown | "Unknown condition error" | "เกิดข้อผิดพลาด" |
| **Validation Errors** | errorNotAuthenticated | "Not Authenticated" | "กรุณาเข้าสู่ระบบ" |
| | errorInsufficientPoints | "Insufficient points..." | "แต้มไม่เพียงพอ..." |
| | errorCampaignExpired | "Campaign Expired" | "แคมเปญหมดอายุ" |
| | errorCampaignSoldOut | "Campaign sold out" | "สินค้าหมด" |
| | errorCampaignNotLoaded | "Campaign not loaded" | "ไม่พบข้อมูลแคมเปญ" |
| | errorVariantOnlyForBuy | "Variant selection only..." | "เลือกตัวเลือกได้เฉพาะ..." |
| | errorSubVariantOnlyForBuy | "Sub-variant selection only for BUY" | "เลือกตัวเลือกย่อยได้เฉพาะแคมเปญซื้อ" |
| | errorVariantOutOfStock | "Selected variant is out of stock" | "ตัวเลือกที่เลือกหมด" |
| | errorSubVariantOutOfStock | "Selected sub-variant is out of stock" | "ตัวเลือกย่อยที่เลือกหมด" |
| | errorSelectVariantFirst | "Please select a variant first" | "กรุณาเลือกตัวเลือกหลักก่อน" |
| | errorQuantityMinimum | "Quantity must be at least 1" | "จำนวนต้องมากกว่า 0" |
| | errorOnlyXAvailable | "Only %d available" | "เหลือเพียง %d ชิ้น" |
| | errorMaxDonateAllowed | "Maximum %d donate allowed" | "บริจาคได้สูงสุด %d" |
| | errorSelectAddress | "Please select a delivery address" | "กรุณาเลือกที่อยู่จัดส่ง" |
| | errorSelectVariant | "Please select a variant" | "กรุณาเลือกตัวเลือก" |
| | errorSelectSubVariant | "Please select a sub-variant" | "กรุณาเลือกตัวเลือกย่อย" |
| | errorAddressNotRequired | "Address not required for this campaign" | "แคมเปญนี้ไม่ต้องใช้ที่อยู่" |
| | errorInvalidAddress | "Invalid address" | "ที่อยู่ไม่ถูกต้อง" |
| | errorInvalidAddressSelected | "Invalid address selected" | "ที่อยู่ที่เลือกไม่ถูกต้อง" |
| | errorInvalidVariant | "Invalid variant" | "ตัวเลือกไม่ถูกต้อง" |
| | errorInvalidQuantity | "Invalid quantity" | "จำนวนไม่ถูกต้อง" |
| | errorInvalidCampaignType | "Invalid campaign type for cart" | "ประเภทแคมเปญไม่ถูกต้อง" |
| | errorTokenRequired | "Token is required" | "กรุณาเข้าสู่ระบบ" |
| | errorAddToCartFailed | "Failed to add to cart" | "เพิ่มในตะกร้าไม่สำเร็จ" |

### Preset Configurations

```kotlin
// English (Default)
CampaignDetailExtractorConfig.DEFAULT

// Thai
CampaignDetailExtractorConfig.THAI
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

// Get current configuration
val currentConfig = campaignDetailService.getDisplayTexts()
```

### Helper Functions

The config provides helper functions for formatted messages:

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

### When to Call

- **At app startup** - Set once in Application class or main Activity
- **On language change** - Update when user changes app language

```kotlin
// Example: In Application class
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize SDK
        BuzzebeesSDK.init(this, config)
        
        // Set display texts for campaign detail service
        BuzzebeesSDK.instance().campaignDetailUseCase.setDisplayTexts(
            CampaignDetailExtractorConfig.THAI
        )
    }
}

// Example: On language change
fun onLanguageChanged(locale: String) {
    val config = if (locale == "th") {
        CampaignDetailExtractorConfig.THAI
    } else {
        CampaignDetailExtractorConfig.DEFAULT
    }
    BuzzebeesSDK.instance().campaignDetailUseCase.setDisplayTexts(config)
}
```

---

## Campaign Types Reference

| Type Value | Constant Name                        | Description                  |
|------------|--------------------------------------|------------------------------|
| 0          | CAMPAIGN_TYPE_DRAW                   | Draw/Lottery campaign        |
| 1          | CAMPAIGN_TYPE_FREE                   | Free campaign                |
| 2          | CAMPAIGN_TYPE_DEAL                   | Deal campaign                |
| 3          | CAMPAIGN_TYPE_BUY                    | Shopping/Purchase campaign   |
| 8          | CAMPAIGN_TYPE_INTERFACE              | Interface campaign           |
| 9          | CAMPAIGN_TYPE_EVENT                  | Event campaign               |
| 10         | CAMPAIGN_TYPE_MEDIA                  | Media campaign               |
| 16         | CAMPAIGN_TYPE_NEWS                   | News campaign                |
| 20         | CAMPAIGN_TYPE_DONATE                 | Donation campaign            |
| 33         | CAMPAIGN_TYPE_MARKETPLACE_PRIVILEGE  | Marketplace privilege        |

---

## Button Catalog Types

The SDK automatically determines the appropriate button type based on campaign configuration:

| Button Type              | Use Case                                        |
|--------------------------|-------------------------------------------------|
| `NoButton`               | Non-redeemable campaigns (Event, Media, News)   |
| `RedeemButton`           | Standard redemption campaigns                   |
| `ShoppingButton`         | BUY campaigns without variants                  |
| `ShoppingWithStyleButton`| BUY campaigns with variants                     |
| `AddressButton`          | Campaigns requiring delivery address            |
| `QuantityButton`         | DONATE campaigns                                |

---

### getCampaignDetail

Retrieves detailed information for a specific campaign. Automatically validates campaign readiness, calculates button catalog, and normalizes display data.

- Request (caller-supplied)

| Field Name   | Description         | Mandatory | Data Type           |
|--------------|---------------------|-----------|---------------------|
| id           | Campaign identifier | M         | String              |
| deviceLocale | Device locale       | O         | Int?                |
| options      | Additional options  | O         | Map<String, String> |

- Response (`CampaignDetails`)
  HTTP status: 200

### CampaignDetails Entity Fields

| Field Name              | Description                      | Data Type          |
|-------------------------|----------------------------------|--------------------|
| id                      | Campaign identifier              | Int?               |
| agencyID                | Agency identifier                | Int?               |
| agencyName              | Agency display name              | String?            |
| name                    | Campaign display name            | String?            |
| detail                  | Detailed campaign description    | String?            |
| condition               | Campaign terms and conditions    | String?            |
| conditionAlert          | Condition alert message          | String?            |
| categoryID              | Category identifier              | Int?               |
| categoryName            | Category display name            | String?            |
| startDate               | Campaign start timestamp         | Long?              |
| currentDate             | Current server timestamp         | Long?              |
| expireDate              | Campaign expiration timestamp    | Long?              |
| location                | Campaign location information    | String?            |
| website                 | Campaign website URL             | String?            |
| discount                | Discount amount/percentage       | Double?            |
| originalPrice           | Original price before discount   | Double?            |
| pricePerUnit            | Price per unit                   | Double?            |
| pointPerUnit            | Points required per unit         | Double?            |
| quantity                | Available quantity               | Double?            |
| qty                     | Available quantity (alternate)   | Double?            |
| redeemMostPerPerson     | Max redemptions per person       | Double?            |
| peopleLike              | Number of people who liked       | Int?               |
| peopleDislike           | Number of people who disliked    | Int?               |
| itemCountSold           | Total items sold                 | Double?            |
| delivered               | Requires delivery address        | Boolean?           |
| buzz                    | Buzz/engagement score            | Int?               |
| type                    | Campaign type identifier         | Int?               |
| isSponsor               | Is sponsored campaign            | Boolean?           |
| dayRemain               | Days remaining until expiration  | Int?               |
| dayProceed              | Days since campaign started      | Int?               |
| soldOutDate             | Date when campaign sold out      | Long?              |
| caption                 | Campaign caption/subtitle        | String?            |
| voucherExpireDate       | Voucher expiration timestamp     | Long?              |
| userLevel               | Required user level              | Long?              |
| redeemCount             | Current redemption count         | Int?               |
| useCount                | Usage count                      | Int?               |
| nextRedeemDate          | Next available redemption date   | Long?              |
| isLike                  | User liked this campaign         | Boolean?           |
| minutesValidAfterUsed   | Minutes valid after use          | Int?               |
| barcode                 | Campaign barcode                 | String?            |
| customInput             | Custom input field               | String?            |
| customCaption           | Custom caption text              | String?            |
| customFacebookMessage   | Custom Facebook sharing message  | String?            |
| interfaceDisplay        | Interface display configuration  | String?            |
| pointType               | Type of points (use/get)         | String?            |
| defaultPrivilegeMessage | Default privilege message        | String?            |
| isNotAutoUse            | Not auto-use flag                | Boolean?           |
| pictures                | Campaign image gallery           | `List<Picture>?`    |
| isConditionPass         | User meets campaign conditions   | Boolean?           |
| conditionAlertId        | Condition alert identifier       | Int?               |
| fullImageUrl            | Full campaign image URL          | String?            |
| subCampaignStyles       | Sub-campaign style configuration | SubCampaignStyle?  |
| subCampaigns            | List of sub-campaigns            | `List<SubCampaign>?` |
| related                 | Related campaigns                | `List<Campaign>?`    |
| isFavourite             | User marked as favorite          | Boolean?           |

### SDK-Calculated Fields (Display/State)

| Field Name               | Description                           | Data Type              |
|--------------------------|---------------------------------------|------------------------|
| canRedeem                | Campaign is ready for redemption      | Boolean?               |
| errorConditionMessage    | Error message if not ready            | String?                |
| campaignCatalog          | Button type to display                | CampaignButtonCatalog  |
| displayCampaignName      | Normalized campaign name              | String                 |
| displayCampaignDescription| Normalized description               | String                 |
| displayConditions        | Normalized conditions                 | String                 |
| displayFullImageUrl      | Normalized full image URL             | String                 |
| displayPictures          | Normalized pictures list              | `List<String>`           |
| displayCampaignPoint     | Formatted points string               | String                 |
| displayVariants          | Normalized variant options            | `List<VariantOption>?`   |
| displaySubVariants       | Normalized sub-variants by variant ID | Map<String, List>?     |

- Usage

```kotlin
// Suspend
val result = campaignDetailService.getCampaignDetail(
    id = "12345",
    deviceLocale = 1054,
    options = mapOf("includeRelated" to "true")
)

// Callback
campaignDetailService.getCampaignDetail("12345", 1054) { result ->
    when (result) {
        is CampaignDetailResult.SuccessCampaignDetail -> {
            val detail = result.result
            
            // Access basic info
            val name = detail.displayCampaignName
            val description = detail.displayCampaignDescription
            val imageUrl = detail.displayFullImageUrl
            val points = detail.displayCampaignPoint
            
            // Check redemption readiness
            val canRedeem = detail.canRedeem
            val errorMessage = detail.errorConditionMessage
            
            // Determine button type
            when (val buttonCatalog = detail.campaignCatalog) {
                is CampaignButtonCatalog.NoButton -> {
                    // Hide redemption button
                }
                is CampaignButtonCatalog.RedeemButton -> {
                    showButton(buttonCatalog.buttonName)
                }
                is CampaignButtonCatalog.ShoppingButton -> {
                    showButton(buttonCatalog.firstButtonName)
                    showSecondaryButton(buttonCatalog.secondButtonName)
                }
                is CampaignButtonCatalog.ShoppingWithStyleButton -> {
                    // Show variant selector first
                    showVariantSelector(detail.displayVariants)
                }
                is CampaignButtonCatalog.AddressButton -> {
                    showAddressSelector()
                    showButton(buttonCatalog.buttonName)
                }
                is CampaignButtonCatalog.QuantityButton -> {
                    showQuantitySelector()
                    showButton(buttonCatalog.buttonName)
                }
            }
        }
        is CampaignDetailResult.Error -> {
            val errorCode = result.error.code
            val errorMessage = result.error.message
        }
    }
}
```

---

## Variant Selection Methods (BUY Campaigns)

### selectVariant

Selects a primary variant for BUY campaigns (e.g., color, material, flavor). Clears any previous sub-variant selection.

- Request

| Field Name    | Description         | Mandatory | Data Type     |
|---------------|---------------------|-----------|---------------|
| variantOption | Variant to select   | M         | VariantOption |

- Response: `String?` (error message or null if success)

### VariantOption Entity Fields

| Field Name | Description         | Data Type |
|------------|---------------------|-----------|
| campaignId | Campaign identifier | String?   |
| name       | Variant name        | String?   |
| value      | Variant value       | String?   |
| price      | Price               | Double?   |
| points     | Points required     | Double?   |
| quantity   | Available quantity  | Int?      |

- Usage

```kotlin
// Get available variants from campaign detail
val variants = campaignDetail.displayVariants ?: emptyList()

// User selects a variant
val selectedVariant = variants.first()
val error = campaignDetailService.selectVariant(selectedVariant)

if (error != null) {
    showError(error)
} else {
    // Variant selected successfully
    // Now show sub-variants if available
    val subVariants = campaignDetail.displaySubVariants?.get(selectedVariant.campaignId)
    if (!subVariants.isNullOrEmpty()) {
        showSubVariantSelector(subVariants)
    }
}
```

---

### selectSubVariant

Selects a sub-variant for the currently selected variant (e.g., size, weight, pack). Must call `selectVariant()` first.

- Request

| Field Name       | Description            | Mandatory | Data Type        |
|------------------|------------------------|-----------|------------------|
| subVariantOption | Sub-variant to select  | M         | SubVariantOption |

- Response: `String?` (error message or null if success)

### SubVariantOption Entity Fields

| Field Name | Description         | Data Type |
|------------|---------------------|-----------|
| campaignId | Campaign identifier | String?   |
| name       | Sub-variant name    | String?   |
| value      | Sub-variant value   | String?   |
| type       | Sub-variant type    | String?   |
| price      | Price               | Double?   |
| points     | Points required     | Double?   |
| quantity   | Available quantity  | Int?      |

- Usage

```kotlin
// Get sub-variants for selected variant
val variantCampaignId = campaignDetailService.getSelectedVariant()?.campaignId
val subVariants = campaignDetail.displaySubVariants?.get(variantCampaignId) ?: emptyList()

// User selects a sub-variant
val selectedSubVariant = subVariants.first()
val error = campaignDetailService.selectSubVariant(selectedSubVariant)

if (error != null) {
    showError(error)
} else {
    // Sub-variant selected, ready for redemption
    enableRedeemButton()
}
```

---

### getSelectedVariant

Returns the currently selected primary variant.

- Response: `VariantOption?`

```kotlin
val currentVariant = campaignDetailService.getSelectedVariant()
currentVariant?.let {
    println("Selected: ${it.name} - ${it.price}")
}
```

---

### getSelectedSubVariant

Returns the currently selected sub-variant.

- Response: `SubVariantOption?`

```kotlin
val currentSubVariant = campaignDetailService.getSelectedSubVariant()
currentSubVariant?.let {
    println("Selected size: ${it.name}")
}
```

---

### clearVariantSelection

Clears both variant and sub-variant selections.

```kotlin
campaignDetailService.clearVariantSelection()
```

---

## Address Selection Methods (Delivery Campaigns)

### selectAddress

Selects a delivery address for campaigns requiring shipping (campaigns with `delivered = true`).

- Request

| Field Name | Description         | Mandatory | Data Type |
|------------|---------------------|-----------|-----------|
| address    | Address to select   | M         | Address   |

- Response: `String?` (error message or null if success)

### Address Entity Fields

| Field Name    | Description         | Data Type |
|---------------|---------------------|-----------|
| rowKey        | Address identifier  | String?   |
| id            | Address ID          | String?   |
| contactNumber | Contact phone       | String?   |
| name          | Recipient name      | String?   |
| address       | Full address        | String?   |
| province      | Province            | String?   |
| district      | District            | String?   |
| subDistrict   | Sub-district        | String?   |
| postalCode    | Postal code         | String?   |

- Usage

```kotlin
// User selects an address from their address list
val selectedAddress = addressList.first()
val error = campaignDetailService.selectAddress(selectedAddress)

if (error != null) {
    showError(error)
} else {
    // Address selected, enable redeem button
    enableRedeemButton()
}
```

---

### getSelectedAddress

Returns the currently selected delivery address.

- Response: `Address?`

```kotlin
val currentAddress = campaignDetailService.getSelectedAddress()
currentAddress?.let {
    println("Delivering to: ${it.name}, ${it.address}")
}
```

---

### clearAddressSelection

Clears the selected address.

```kotlin
campaignDetailService.clearAddressSelection()
```

---

## Quantity Methods (BUY/DONATE Campaigns)

### setQuantity

Sets the quantity for redemption. Validates against available stock and limits.

- Request

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|-----------|
| quantity   | Quantity    | M         | Int       |

- Response: `String?` (error message or null if success)

```kotlin
val error = campaignDetailService.setQuantity(3)
if (error != null) {
    showError(error) // e.g., "Only 2 available, you requested 3"
}
```

---

### getSelectedQuantity

Returns the currently selected quantity (default: 1).

- Response: `Int`

```kotlin
val qty = campaignDetailService.getSelectedQuantity()
println("Current quantity: $qty")
```

---

### increaseQuantity

Increases quantity by 1. Validates against limits.

- Response: `String?` (error message or null if success)

```kotlin
val error = campaignDetailService.increaseQuantity()
if (error != null) {
    showError(error)
}
```

---

### decreaseQuantity

Decreases quantity by 1 (minimum 1).

- Response: `String?` (error message or null if at minimum)

```kotlin
val error = campaignDetailService.decreaseQuantity()
// Returns null if already at 1
```

---

### resetQuantity

Resets quantity to 1.

```kotlin
campaignDetailService.resetQuantity()
```

---

## Utility Methods

### clearAllSelections

Clears all selections (variant, sub-variant, address) and resets quantity to 1. Call when switching campaigns or user cancels.

```kotlin
campaignDetailService.clearAllSelections()
```

---

### redeem

Executes campaign redemption. Automatically validates selections, handles different campaign types, and returns appropriate next steps.

- Request

| Field Name | Description        | Mandatory | Data Type           |
|------------|--------------------|-----------|---------------------|
| options    | Additional options | O         | Map<String, String> |

- Response (`CampaignDetailResult`)

### RedeemResponse Entity Fields

| Field Name             | Description                    | Data Type             |
|------------------------|--------------------------------|-----------------------|
| campaignId             | Campaign identifier            | Int?                  |
| itemNumber             | Item number                    | Int?                  |
| serial                 | Serial/code                    | String?               |
| agencyId               | Agency identifier              | Int?                  |
| agencyName             | Agency display name            | String?               |
| name                   | Redemption name                | String?               |
| nextRedeemDate         | Next available redemption date | Long?                 |
| currentDate            | Current server timestamp       | Long?                 |
| redeemCount            | Current redemption count       | Int?                  |
| useCount               | Usage count                    | Int?                  |
| qty                    | Available quantity             | Double?               |
| isConditionPass        | User meets conditions          | Boolean?              |
| conditionAlert         | Condition alert message        | String?               |
| isNotAutoUse           | Not auto-use flag              | Boolean?              |
| pointType              | Type of points used            | String?               |
| interfaceDisplay       | Interface display config       | String?               |
| redeemKey              | Redemption key                 | String?               |
| pricePerUnit           | Price per unit                 | Double?               |
| redeemDate             | Redemption timestamp           | Long?                 |
| campaignName           | Campaign display name          | String?               |
| pointPerUnit           | Points per unit                | Double?               |
| expireIn               | Expiration period              | Long?                 |
| privilegeMessage       | Privilege message              | String?               |
| privilegeMessageEN     | Privilege message in English   | String?               |

### NextStep Sealed Class

The SDK returns a `NextStep` indicating what UI action to take after redemption:

| NextStep Type          | Description                              | Fields                              |
|------------------------|------------------------------------------|-------------------------------------|
| `ShowCode`             | Display redemption code                  | redeemKey, code, campaignId         |
| `ShowPointsEarned`     | Display points earned                    | redeemKey, pointsEarned, campaignId |
| `ShowDrawSuccess`      | Display draw/donate success              | redeemKey, campaignId, code?, pointsEarned? |
| `ShowAddToCartSuccess` | Show cart success (BUY campaigns)        | cartUrl                             |
| `OpenWebsite`          | Open external URL                        | url, urlType                        |

- Usage

```kotlin
// Suspend
val result = campaignDetailService.redeem(mapOf())

// Callback
campaignDetailService.redeem(mapOf()) { result ->
    when (result) {
        is CampaignDetailResult.SuccessRedeem -> {
            val redeemResponse = result.result
            val nextStep = result.nextStep
            
            // Handle based on next step type
            when (nextStep) {
                is NextStep.ShowCode -> {
                    // Display redemption code to user
                    showRedemptionCode(
                        code = nextStep.code,
                        redeemKey = nextStep.redeemKey
                    )
                }
                is NextStep.ShowPointsEarned -> {
                    // Display points earned
                    showPointsEarnedDialog(nextStep.pointsEarned)
                }
                is NextStep.ShowDrawSuccess -> {
                    // Display draw/donate success
                    showSuccessDialog(
                        code = nextStep.code,
                        pointsEarned = nextStep.pointsEarned
                    )
                }
                is NextStep.ShowAddToCartSuccess -> {
                    // Navigate to cart or show success
                    showAddToCartSuccess()
                    nextStep.cartUrl?.let { openCart(it) }
                }
                is NextStep.OpenWebsite -> {
                    // Open webview/browser
                    openWebView(nextStep.url, nextStep.urlType)
                }
            }
        }
        is CampaignDetailResult.Error -> {
            val errorCode = result.error.code
            val errorMessage = result.error.message
            showError(errorMessage)
        }
    }
}
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
                    
                    // Check if BUY campaign with variants
                    if (detail.campaignCatalog is CampaignButtonCatalog.ShoppingWithStyleButton) {
                        // Show variant selector
                        showVariants(detail.displayVariants ?: emptyList())
                    }
                }
                is CampaignDetailResult.Error -> handleError(result.error)
            }
        }
    }
    
    fun onVariantSelected(variant: VariantOption, detail: CampaignDetails) {
        val error = campaignDetail.selectVariant(variant)
        if (error != null) {
            showError(error)
            return
        }
        
        // Check for sub-variants
        val subVariants = detail.displaySubVariants?.get(variant.campaignId)
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
        if (error != null) {
            showError(error)
        }
    }
    
    fun addToCart() {
        campaignDetail.redeem(mapOf()) { result ->
            when (result) {
                is CampaignDetailResult.SuccessRedeem -> {
                    val nextStep = result.nextStep
                    if (nextStep is NextStep.ShowAddToCartSuccess) {
                        showCartSuccess(nextStep.cartUrl)
                    }
                }
                is CampaignDetailResult.Error -> handleError(result.error)
            }
        }
    }
}
```

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
                        // Show address selector
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

## CampaignDetailResult Sealed Class

All methods return a `CampaignDetailResult` which is a sealed class:

```kotlin
sealed class CampaignDetailResult {
    data class SuccessCampaignDetail(val result: CampaignDetails) : CampaignDetailResult()
    data class SuccessRedeem(val result: RedeemResponse, val nextStep: NextStep) : CampaignDetailResult()
    data class Error(val error: ErrorInfo) : CampaignDetailResult()
}
```

---

## Error Handling

| Error Code | Scenario                     | User Message                           |
|------------|------------------------------|----------------------------------------|
| -2         | Token required               | "Token is required"                    |
| -99        | Invalid campaign type        | "Invalid campaign type for cart"       |
| -100       | Invalid variant              | "Please select a variant"              |
| -101       | Invalid quantity             | "Invalid qty"                          |
| -102       | Address required             | "Please select a delivery address"     |

### Condition Alert Codes

| Alert ID | Description                                                    |
|----------|----------------------------------------------------------------|
| 1        | Campaign sold out                                              |
| 2        | Max redemption per person reached                              |
| 3        | Campaign in cool down period                                   |
| 1403     | Condition invalid                                              |
| 1406     | Sponsor only campaign                                          |
| 1409     | Campaign expired                                               |
| 1410     | Campaign not started yet                                       |
| 1416     | App version expired                                            |
| 1427     | Privilege cannot be redeemed under specified terms             |

---

## getMyPoint

Retrieves the current user's available points. Returns cached data if available, otherwise fetches from API.

- Response: `Long?` (null if not authenticated or error)

### Method Signatures

```kotlin
// Suspend
suspend fun getMyPoint(): Long?

// Callback
fun getMyPoint(callback: (Long?) -> Unit)
```

### Usage

```kotlin
// Suspend
val points = campaignDetailService.getMyPoint()
points?.let {
    println("Available points: $it")
} ?: println("Unable to get points")

// Callback
campaignDetailService.getMyPoint { points ->
    points?.let {
        updatePointsDisplay(it)
    } ?: showLoginPrompt()
}
```

### Behavior

- Returns `null` if user is not authenticated
- Uses cached profile data if available for faster response
- Fetches from API if cache is empty and saves to cache
- Returns `null` on any error (network, parsing, etc.)

### Example: Display Points Before Redemption

```kotlin
class RedemptionViewModel {
    private val campaignDetailUseCase = BuzzebeesSDK.instance().campaignDetailUseCase
    
    fun checkPointsAndRedeem(campaignId: String, requiredPoints: Long) {
        campaignDetailUseCase.getMyPoint { currentPoints ->
            when {
                currentPoints == null -> {
                    showError("Please login to continue")
                }
                currentPoints < requiredPoints -> {
                    showInsufficientPointsDialog(
                        required = requiredPoints,
                        available = currentPoints
                    )
                }
                else -> {
                    proceedWithRedemption(campaignId)
                }
            }
        }
    }
}
```

---

## Summary

The CampaignDetailUseCase provides complete campaign detail management including:

- **`setDisplayTexts()` method** - Configure all button names, error messages, and condition alerts once
- **Campaign Detail Retrieval**: Automatic validation, button catalog calculation, and display normalization
- **Variant Selection**: Primary and sub-variant selection for BUY campaigns with cascading validation
- **Address Selection**: Delivery address management for shipped campaigns
- **Quantity Management**: Quantity selection with stock validation for BUY and DONATE campaigns
- **Redemption**: Unified redemption flow handling different campaign types with appropriate next step guidance
- **Points Query**: `getMyPoint()` method for checking user's available points with caching

**Key Features:**
- Easy localization - just change config at startup
- Consistent texts across all campaign operations
- Built-in presets for English (`DEFAULT`) and Thai (`THAI`)
- Helper functions for formatted error messages
- All methods available in both suspend (coroutine) and callback versions

The SDK handles complex validation, state management, and flow determination automatically.

---

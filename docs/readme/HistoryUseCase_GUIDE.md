# HistoryUseCase Guide

This guide shows how to initialize and use every public method in `HistoryUseCase`, with suspend and callback examples where available. The HistoryUseCase provides comprehensive history management functionality for retrieving user purchase history and using redeemed campaigns.

## Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Core Methods](#core-methods)
  - [getHistory](#gethistory)
  - [useRedeem](#useredeem)
  - [processRedeem](#processredeem)
  - [processRedeemAction](#processredeemaction)
  - [useNow](#usenow)
  - [getRedeemAddress](#getredeemaddress)
- [Purchase Entity](#purchase-entity)
- [Display System Architecture](#display-system-architecture)
- [Complete Usage Example](#complete-usage-example)
- [Status Decision Flow](#status-decision-flow)

---

## Getting Started

### Getting an Instance

```kotlin
val historyService = BuzzebeesSDK.instance().history
```

### Quick Start

```kotlin
// 1. Set config once at initialization
historyService.setConfig(HistoryConfigBuilder.thai())

// 2. Use methods without worrying about localization
val result = historyService.getHistory(form)
val processResult = historyService.processRedeemAction(purchase)  // When user clicks item
val useResult = historyService.useNow(purchase)  // For confirm use flow
```

---

## Configuration

### setConfig

Set configuration once at initialization. After setting, all status messages, button labels, and error messages will use these texts automatically.

#### Method Signature

```kotlin
fun setConfig(builder: HistoryConfigBuilder)
```

#### HistoryExtractorConfig Fields

| Category | Field | Default (English) | Thai |
|----------|-------|-------------------|------|
| **Primary Status** | statusReady | "Ready to use" | "พร้อมใช้งาน" |
| | statusExpired | "Expired" | "หมดอายุ" |
| | statusUsed | "Used" | "ใช้แล้ว" |
| | statusCompleted | "Completed" | "เสร็จสิ้น" |
| | statusDonated | "Donated" | "บริจาคแล้ว" |
| | statusRedeemed | "Redeemed" | "แลกแล้ว" |
| **Draw Status** | drawStatusWaiting | "Waiting for result" | "รอประกาศผล" |
| | drawStatusWinner | "Winner" | "ถูกรางวัล" |
| | drawStatusNotWinner | "Not a winner" | "ไม่ถูกรางวัล" |
| **Delivery Status** | deliveryStatusPreparing | "Preparing" | "เตรียมจัดส่ง" |
| | deliveryStatusShipped | "Shipped" | "จัดส่งแล้ว" |
| | deliveryStatusSuccess | "Delivered" | "จัดส่งสำเร็จ" |
| **Button Labels** | buttonViewCode | "View Code" | "ดูโค้ด" |
| | buttonConfirmUse | "Use at store" | "กดเพื่อใช้ที่ร้านค้า" |
| | buttonDownloadSticker | "Download Sticker" | "ดาวน์โหลดสติกเกอร์" |
| | buttonTransferPoint | "Transfer Points" | "โอนคะแนน" |
| | buttonOpenWebsite | "Open Website" | "เปิดเว็บไซต์" |
| | buttonShowInfo | "View Details" | "ดูรายละเอียด" |
| **Error Messages** | errorTokenRequired | "Token is required" | "กรุณาเข้าสู่ระบบ" |
| | errorCannotUse | "This item cannot be used" | "ไม่สามารถใช้งานรายการนี้ได้" |
| | errorNoAction | "No action available for this item" | "ไม่มีการดำเนินการสำหรับรายการนี้" |
| | errorRedeemKeyRequired | "RedeemKey is required" | "ไม่พบรหัสแลก" |
| | errorNoData | "No data" | "ไม่พบข้อมูล" |
| | errorNoUrl | "No url" | "ไม่พบลิงก์" |
| | errorNoCode | "No code available" | "ไม่พบรหัส" |

#### Preset Configurations

```kotlin
// English (Default)
HistoryConfigBuilder.english()

// Thai
HistoryConfigBuilder.thai()
```

#### Usage Examples

```kotlin
// Option 1: Use Thai language
historyService.setConfig(HistoryConfigBuilder.thai())

// Option 2: Use English (default)
historyService.setConfig(HistoryConfigBuilder.english())

// Option 3: Custom configuration - individual setters
historyService.setConfig(
    HistoryConfigBuilder.thai()
        .statusText(StatusType.EXPIRED, "สิทธิ์หมดอายุแล้ว")
        .buttonLabel(ButtonLabelType.VIEW_CODE, "ดูโค้ดของฉัน")
)

// Option 4: Custom configuration - batch setters
historyService.setConfig(
    HistoryConfigBuilder.thai()
        .statusTexts(
            expired = "หมดอายุแล้ว",
            used = "ใช้ไปแล้ว"
        )
        .buttonLabels(
            viewCode = "ดูโค้ด",
            showInfo = "ดูข้อมูล"
        )
)
```

### Builder Methods

#### Individual Setters
```kotlin
// Set individual status text
builder.statusText(StatusType.REDEEMED, "แลกสำเร็จ!")

// Set individual draw status text
builder.drawStatusText(DrawStatusType.WINNER, "ถูกรางวัล! 🎉")

// Set individual delivery status text
builder.deliveryStatusText(DeliveryStatusType.SHIPPED, "ส่งแล้ว")

// Set individual button label
builder.buttonLabel(ButtonLabelType.VIEW_CODE, "ดูโค้ดของฉัน")

// Set individual not support message
builder.notSupportMessage(NotSupportType.DRAW_NOT_WINNER, "ไม่ได้รางวัลครั้งนี้")

// Set individual error message
builder.errorMessage(HistoryErrorType.NO_CODE, "ไม่มีโค้ด")
```

#### Batch Setters
```kotlin
// Set multiple status texts at once
builder.statusTexts(
    redeemed = "แลกแล้ว",
    used = "ใช้แล้ว"
)

// Set multiple draw status texts at once
builder.drawStatusTexts(
    winner = "ชนะรางวัล",
    notWinner = "ไม่ได้รางวัล"
)

// Set multiple delivery status texts at once
builder.deliveryStatusTexts(
    preparing = "กำลังเตรียมส่ง",
    shipped = "ส่งออกแล้ว"
)

// Set multiple button labels at once
builder.buttonLabels(
    viewCode = "ดูรหัส",
    showInfo = "ดูรายละเอียด"
)

// Set multiple not support messages at once
builder.notSupportMessages(
    campaignExpired = "หมดอายุแล้ว",
    drawPending = "รอประกาศผล"
)
```

#### Preset Methods
```kotlin
// Apply Thai presets
builder.thaiStatusTexts()
builder.thaiDrawStatusTexts()
builder.thaiDeliveryStatusTexts()
builder.thaiButtonLabels()
builder.thaiNotSupportMessages()
builder.thaiErrorMessages()

// Apply English presets
builder.englishStatusTexts()
builder.englishDrawStatusTexts()
builder.englishDeliveryStatusTexts()
builder.englishButtonLabels()
builder.englishNotSupportMessages()
builder.englishErrorMessages()
```

### Available Enums

#### StatusType
- `READY` - Ready to use
- `EXPIRED` - Expired
- `USED` - Used
- `COMPLETED` - Completed
- `DONATED` - Donated
- `REDEEMED` - Redeemed

#### DrawStatusType
- `WAITING` - Waiting for result
- `WINNER` - Winner
- `NOT_WINNER` - Not a winner

#### DeliveryStatusType
- `PREPARING` - Preparing for shipment
- `SHIPPED` - Item has been shipped
- `SUCCESS` - Delivery successful

#### ButtonLabelType
- `VIEW_CODE` - View code button
- `CONFIRM_USE` - Confirm use at store button
- `DOWNLOAD_STICKER` - Download LINE sticker button
- `TRANSFER_POINT` - Transfer points button
- `OPEN_WEBSITE` - Open website button
- `SHOW_INFO` - Show information button

#### NotSupportType
- `CAMPAIGN_EXPIRED` - Campaign has expired
- `UNSUPPORTED_TYPE` - Campaign type not supported
- `DRAW_PENDING` - Draw result pending
- `DRAW_NOT_WINNER` - User is not a winner
- `SURVEY_COMPLETED` - Survey already completed
- `NO_WEBSITE` - No website available
- `DELIVERY_IN_PROGRESS` - Delivery in progress
- `INTERFACE_NOT_SUPPORTED` - Interface type not supported
- `NO_ACTION` - No action available

#### HistoryErrorType
- `TOKEN_REQUIRED` - Token is required
- `CANNOT_USE` - Item cannot be used
- `NO_ACTION` - No action available
- `REDEEM_KEY_REQUIRED` - Redeem key is required
- `NO_DATA` - No data found
- `NO_URL` - No URL found
- `NO_CODE` - No code found

#### When to Call

- **At app startup** - Set once in Application class or main Activity
- **On language change** - Update when user changes app language

```kotlin
// Example: In Application class
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize SDK
        BuzzebeesSDK.init(this, config)
        
        // Set config for history service
        BuzzebeesSDK.instance().history.setConfig(HistoryConfigBuilder.thai())
    }
}

// Example: On language change
fun onLanguageChanged(locale: String) {
    val builder = if (locale == "th") {
        HistoryConfigBuilder.thai()
    } else {
        HistoryConfigBuilder.english()
    }
    BuzzebeesSDK.instance().history.setConfig(builder)
}
```

---

## Core Methods

### getHistory

Retrieves the user's purchase and redemption history with filtering and pagination options. Uses display texts from `setConfig()` configuration.

> **Note:** Data from this API may have incorrect values for some fields (e.g., `isRequireUniqueSerial`, `isNotAutoUse`, `isUsed`, `serial`, `barcode`, `expireIn`). Always use `processRedeemAction()` when user clicks on an item to get correct data.

#### Request Parameters (HistoryForm)

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|-----------|
| byConfig | Filter by configuration flag | O | Boolean |
| config | Configuration identifier from Backoffice | M | String |
| skip | Number of records to skip for pagination | O | Int? |
| top | Maximum number of records to return | O | Int? |
| locale | User language (1054: Thai, 1033: English) | O | Int? |
| startDate | Filter start date (ISO format: "YYYY-MM-DDTHH:mm:ss") | O | String? |
| endDate | Filter end date (ISO format: "YYYY-MM-DDTHH:mm:ss") | O | String? |

#### Response

Returns `HistoryResult` which is either:
- `HistoryResult.SuccessList` - Contains `result: List<Purchase>` with pre-computed display fields
- `HistoryResult.Error` - Contains error information

#### Usage Examples

```kotlin
// Set display texts once (typically at app startup)
historyService.setConfig(HistoryConfigBuilder.thai())

// Create form - Basic
val historyForm = HistoryForm(
    byConfig = true,
    config = "purchase",
    skip = 0,
    top = 20,
    locale = 1054
)

// Create form - With date filter
val historyFormWithDate = HistoryForm(
    byConfig = true,
    config = "purchase",
    skip = 0,
    top = 20,
    locale = 1054,
    startDate = "2024-01-01T00:00:00",
    endDate = "2024-12-31T23:59:59"
)

// Suspend
val result = historyService.getHistory(historyForm)

when (result) {
    is HistoryResult.SuccessList -> {
        result.result.forEach { purchase ->
            // Display fields are pre-computed with configured texts
            println("Name: ${purchase.displayMessage}")
            println("Status: ${purchase.displayStatus.label}")
            println("Button: ${purchase.buttonLabel}")
            println("Can Click: ${purchase.displayType.canClick}")
        }
    }
    is HistoryResult.Error -> {
        println("Error: ${result.error.error?.message}")
    }
    else -> {}
}

// Callback
historyService.getHistory(historyForm) { result ->
    when (result) {
        is HistoryResult.SuccessList -> {
            adapter.submitList(result.result)
        }
        is HistoryResult.Error -> {
            showError(result.error.error?.message)
        }
        else -> {}
    }
}
```

---

### useRedeem

Use a redeem key directly. Calls the use API to activate the code.

#### Request Parameters

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|--------|
| redeemKey | The redeem key to use | M | String |

#### Response

Returns `HistoryResult` which is either:
- `HistoryResult.SuccessUse` - Contains `UseCampaignResponse` and `ShowCode`
- `HistoryResult.Error` - Contains error information

#### Usage Examples

```kotlin
// Suspend
val result = historyService.useRedeem("REDEEM_KEY_123")

when (result) {
    is HistoryResult.SuccessUse -> {
        val code = result.nextStep.code
        val expireIn = result.result.expireIn
        showCodeDialog(result.nextStep as HistoryNextStep.ShowCode)
    }
    is HistoryResult.Error -> {
        showError(result.error.error?.message)
    }
    else -> {}
}

// Callback
historyService.useRedeem(redeemKey) { result ->
    when (result) {
        is HistoryResult.SuccessUse -> showCode(result.nextStep)
        is HistoryResult.Error -> showError(result.error)
        else -> {}
    }
}
```

---

### processRedeem

Get inquiry data for a redeem key. Calls the inquiry API to get updated Purchase data.

> **Note:** Data from `getHistory()` may be stale. Use this to get current data.

#### Request Parameters

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|--------|
| redeemKey | The redeem key to get inquiry data for | M | String |

#### Response

Returns `HistoryResult` which is either:
- `HistoryResult.SuccessInquiryHistory` - Contains updated `Purchase`
- `HistoryResult.Error` - Contains error information

#### Usage Examples

```kotlin
// Suspend
val result = historyService.processRedeem("REDEEM_KEY_123")

when (result) {
    is HistoryResult.SuccessInquiryHistory -> {
        val updatedPurchase = result.result
        updateUI(updatedPurchase)
    }
    is HistoryResult.Error -> {
        showError(result.error.error?.message)
    }
    else -> {}
}

// Callback
historyService.processRedeem(redeemKey) { result ->
    when (result) {
        is HistoryResult.SuccessInquiryHistory -> updateUI(result.result)
        is HistoryResult.Error -> showError(result.error)
        else -> {}
    }
}
```

---

### processRedeemAction

Process redeem action to determine next step. Called when user clicks on a history item.

> **Important:** Data from `getHistory()` list may have incorrect values. This method fetches correct data from inquiry API before determining the action.

#### Request Parameters

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|-----------|
| purchase | Purchase object from history list | M | Purchase |

#### Response

Returns `HistoryResult` which is either:
- `HistoryResult.SuccessProcessRedeem` - Contains `purchase` (with correct data from inquiry) and `nextStep`
- `HistoryResult.Error` - Contains error information

#### HistoryNextStep Types

```kotlin
sealed class HistoryNextStep : Parcelable {

    /** Show redemption code with optional countdown timer */
    data class ShowCode(
        val code: String,
        val barcode: String?,
        val hasCountdown: Boolean,
        val countdownSeconds: Long?,
        val redeemDate: Long?
    ) : HistoryNextStep()
    
    /** Show confirm use dialog ("Use Now / Use Later") */
    data class ShowConfirmUse(val purchase: Purchase) : HistoryNextStep()
    
    /** Open external website URL */
    data class OpenWebsite(val url: String) : HistoryNextStep()
    
    /** Show transfer point dialog (The1, TruePoint) */
    data class ShowTransferPointDialog(
        val campaignId: String,
        val campaignName: String,
        val fullImageUrl: String,
        val pointPerUnit: Double,
        val redeemDate: Long,
        val categoryId: String,
        val transactionId: String
    ) : HistoryNextStep()
    
    /** Show privilege content for draw winners */
    data class ShowInformation(val purchase: Purchase) : HistoryNextStep()
}
```

#### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    User clicks on history item                   │
│                       processRedeem(purchase)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │       Route by displayType        │
              └───────────────────────────────────┘
                    │         │         │
         ┌──────────┘         │         └──────────┐
         ▼                    ▼                    ▼
   ┌───────────┐       ┌───────────┐        ┌───────────┐
   │ Purchase  │       │ Interface │        │   Draw    │
   │ (FREE/    │       │ (Sticker, │        │ (Winner)  │
   │  DEAL)    │       │  Website) │        │           │
   └───────────┘       └───────────┘        └───────────┘
         │                    │                    │
         ▼                    │                    │
┌─────────────────┐           │                    │
│ Fetch Inquiry   │           │                    │
│ API (correct    │           │                    │
│ data)           │           │                    │
└─────────────────┘           │                    │
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ ShowCode or     │  │ OpenWebsite or  │  │ ShowInformation │
│ ShowConfirmUse  │  │ TransferPoint   │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### Usage Example

```kotlin
// Suspend
val result = historyService.processRedeemAction(purchase)

when (result) {
    is HistoryResult.SuccessProcessRedeem -> {
        when (val nextStep = result.nextStep) {
            is HistoryNextStep.ShowCode -> {
                // Show code directly (already used or auto-use)
                showCodeDialog(
                    code = nextStep.code,
                    barcode = nextStep.barcode,
                    hasCountdown = nextStep.hasCountdown,
                    countdownSeconds = nextStep.countdownSeconds,
                    redeemDate = nextStep.redeemDate
                )
            }
            is HistoryNextStep.ShowConfirmUse -> {
                // Show confirm dialog, then call useNow() if confirmed
                showConfirmUseDialog(
                    purchase = nextStep.purchase,
                    onConfirm = {
                        // User confirmed, call useNow()
                        historyService.useNow(nextStep.purchase) { useResult ->
                            when (useResult) {
                                is HistoryResult.SuccessProcessRedeem -> {
                                    showCodeDialog(useResult.nextStep as HistoryNextStep.ShowCode)
                                }
                                is HistoryResult.Error -> showError(useResult.error)
                                else -> {}
                            }
                        }
                    }
                )
            }
            is HistoryNextStep.OpenWebsite -> {
                openUrl(nextStep.url)
            }
            is HistoryNextStep.ShowTransferPointDialog -> {
                showTransferPointDialog(nextStep)
            }
            is HistoryNextStep.ShowInformation -> {
                // Show privilege content for draw winners
                showInformationDialog(nextStep.purchase)
            }
        }
    }
    is HistoryResult.Error -> {
        showError(result.error.error?.message)
    }
    else -> {}
}

// Callback
historyService.processRedeemAction(purchase) { result ->
    when (result) {
        is HistoryResult.SuccessProcessRedeem -> handleNextStep(result.nextStep)
        is HistoryResult.Error -> showError(result.error.error?.message)
        else -> {}
    }
}
```

---

### useNow

Use redeem and get updated data. Convenience method for "Use Now" action.

**Combines:**
1. `useRedeem()` - Activate the code
2. `processRedeem()` - Get updated inquiry data
3. Return `ShowCode` with fresh data **Only call this after user confirms in ShowConfirmUse dialog.**



#### Request Parameters

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|-----------|
| purchase | Purchase object | M | Purchase |

#### Response

Returns `HistoryResult` which is either:
- `HistoryResult.SuccessProcessRedeem` - Contains updated `Purchase` and `ShowCode`
- `HistoryResult.Error` - Contains error information

#### Usage Example

```kotlin
// Called after user confirms in ShowConfirmUse dialog
fun onUserConfirmUse(purchase: Purchase) {
    viewModelScope.launch {
        when (val result = historyService.useNow(purchase)) {
            is HistoryResult.SuccessProcessRedeem -> {
                val showCode = result.nextStep as HistoryNextStep.ShowCode
                val updatedPurchase = result.result
                showCodeDialog(
                    code = showCode.code,
                    barcode = showCode.barcode,
                    hasCountdown = showCode.hasCountdown,
                    countdownSeconds = showCode.countdownSeconds,
                    purchase = updatedPurchase
                )
            }
            is HistoryResult.Error -> {
                showError(result.error.error?.message)
            }
            else -> {}
        }
    }
}
```

---

### getRedeemAddress

Retrieves redemption address information for delivery or pickup purposes.

#### Request Parameters

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|-----------|
| redeemKey | Unique redemption key from purchase | M | String |
| locale | Locale for address formatting (optional) | O | Int? |

#### Response

Returns `HistoryResult.SuccessRedeemAddressRaw` with raw address data.

#### Usage Example

```kotlin
// Suspend
val result = historyService.getRedeemAddress(
    redeemKey = "redeem_key_12345",
    locale = 1054
)

when (result) {
    is HistoryResult.SuccessRedeemAddressRaw -> {
        val addressData = result.result.string()
        // Parse and display address
    }
    is HistoryResult.Error -> {
        showError(result.error.error?.message)
    }
    else -> {}
}
```

---

## Purchase Entity

### Raw Fields from API

| Field Name | Description | Data Type | JSON Field |
|------------|-------------|-----------|------------|
| agencyName | Agency/merchant name | String? | AgencyName |
| iD | Purchase/campaign identifier | Int? | ID |
| agencyID | Agency identifier | Int? | AgencyID |
| name | Campaign/item name | String? | Name |
| detail | Campaign/item details | String? | Detail |
| condition | Usage conditions and terms | String? | Condition |
| categoryID | Category identifier | Int? | CategoryID |
| categoryName | Category display name | String? | CategoryName |
| startDate | Campaign start date timestamp | Long? | StartDate |
| expireDate | Campaign expiration date timestamp | Long? | ExpireDate |
| location | Physical location or store address | String? | Location |
| website | Campaign website URL | String? | Website |
| discount | Discount amount or percentage | Double? | Discount |
| originalPrice | Original price before discount | Double? | OriginalPrice |
| pricePerUnit | Price per unit | Double? | PricePerUnit |
| pointPerUnit | Points required per unit | Double? | PointPerUnit |
| quantity | Available quantity | Double? | Quantity |
| delivered | Delivery required flag | Boolean? | Delivered |
| type | Campaign type identifier | Int? | Type |
| serial | Serial number or voucher code | String? | Serial |
| redeemDate | Date when redeemed (timestamp) | Long? | RedeemDate |
| isUsed | Usage status flag | Boolean? | IsUsed |
| isWinner | Winner status for contests | Boolean? | IsWinner |
| isShipped | Shipping status flag | Boolean? | IsShipped |
| hasWinner | Contest has winner flag | Boolean? | HasWinner |
| voucherExpireDate | Voucher expiration date | Long? | VoucherExpireDate |
| parcelNo | Parcel tracking number | String? | ParcelNo |
| expireIn | Seconds until expiration | Int? | ExpireIn |
| interfaceDisplay | UI display configuration | String? | InterfaceDisplay |
| pointType | Points type identifier | String? | PointType |
| privilegeMessage | Privilege message content | String? | PrivilegeMessage |
| privilegeMessageFormat | Privilege message format type | String? | PrivilegeMessageFormat |
| redeemKey | Unique redemption key | String? | RedeemKey |
| fullImageUrl | Full resolution image URL | String? | FullImageUrl |
| info1 | Additional info field 1 (transaction ID) | String? | Info1 |
| info2 | Additional info field 2 | String? | Info2 |
| info3 | Additional info field 3 | String? | Info3 |
| info4 | Additional info field 4 | String? | Info4 |
| info5 | Additional info field 5 | String? | Info5 |
| isRequireUniqueSerial | Requires unique serial code | Boolean? | IsRequireUniqueSerial |
| isNotAutoUse | Not auto-use flag | Boolean? | IsNotAutoUse |
| barcode | Barcode value | String? | Barcode |

> **Important:** Fields like `isRequireUniqueSerial`, `isNotAutoUse`, `isUsed`, `serial`, `barcode`, and `expireIn` may have incorrect values from `getHistory()`. Use `processRedeem()` to get correct values.

### Computed Display Fields (Auto-populated by SDK)

These fields are automatically computed using the configured `HistoryExtractorConfig`:

| Field Name | Description | Data Type |
|------------|-------------|-----------|
| displayType | Campaign display type | BzbsRedeemCampaignDisplayType |
| displayStatus | Primary status (uses config texts) | DisplayStatus |
| displayDeliveryStatus | Delivery status (optional) | DeliveryStatus? |
| displayMessage | Formatted display message | String? |
| displayFullImageUrl | Full image URL with CDN | String? |
| displayPoint | Formatted point display | String? |
| displayDate | Formatted date display | String? |
| buttonLabel | Button text (from config) | String? |

### Accessing Display Data (Direct Access Pattern)

All display data is accessed directly from the normalized fields:

| Data Needed | Access Pattern |
|-------------|----------------|
| Can click? | `purchase.displayType.canClick` |
| Status label | `purchase.displayStatus.label` |
| Status color | `purchase.displayStatus.color` |
| Is draw? | `purchase.displayType.isDraw` or `purchase.displayStatus.isDraw` |
| Has delivery? | `purchase.displayType.hasDelivery` |
| Tracking number | `purchase.displayDeliveryStatus?.trackingNo` |
| Privilege content | `purchase.displayStatus.privilegeContent` |
| Button label | `purchase.buttonLabel` |

#### Example Usage

```kotlin
// Check if item can be clicked
if (purchase.displayType.canClick) {
    // Show action button, use processRedeem() when clicked
}

// Display status badge
StatusBadge(
    label = purchase.displayStatus.label,
    color = purchase.displayStatus.color
)

// Display delivery status if available
purchase.displayDeliveryStatus?.let { delivery ->
    StatusBadge(label = delivery.label, color = delivery.color)
    
    // Copy tracking number if available
    delivery.trackingNo?.let { trackingNo ->
        CopyableTrackingNumber(trackingNo)
    }
}

// Display privilege content for draw winners
purchase.displayStatus.privilegeContent?.let { content ->
    PrivilegeContentDisplay(content)
}
```

---

## Display System Architecture

### BzbsRedeemCampaignDisplayType (Main Display Type)

The `displayType` field determines the overall display behavior:

```kotlin
sealed class BzbsRedeemCampaignDisplayType : Parcelable {
    abstract val canClick: Boolean

    // Standard purchase with action button
    data object Purchase : BzbsRedeemCampaignDisplayType()
    
    // Delivery item with tracking
    data class Delivery(val trackingNo: String? = null) : BzbsRedeemCampaignDisplayType()
    
    // Delivery item without tracking yet
    data object DeliveryNoParcel : BzbsRedeemCampaignDisplayType()
    
    // Draw campaign (only winners can click)
    data class Draw(val isWinner: Boolean) : BzbsRedeemCampaignDisplayType()
    
    // Draw winner with delivery (preparing)
    data class DrawDelivery(val isWinner: Boolean) : BzbsRedeemCampaignDisplayType()
    
    // Draw winner with delivery (shipped with tracking)
    data class DrawDeliveryParcel(
        val trackingNo: String? = null,
        val isWinner: Boolean
    ) : BzbsRedeemCampaignDisplayType()
    
    // Interface campaign (web-based actions)
    data object Interface : BzbsRedeemCampaignDisplayType()
    
    // Message only (no action)
    data class Message(val privilegeContent: PrivilegeContent? = null) : BzbsRedeemCampaignDisplayType()
    
    // Expired item
    data object Expired : BzbsRedeemCampaignDisplayType()

    // Helper properties
    val isDraw: Boolean
        get() = this is Draw || this is DrawDelivery || this is DrawDeliveryParcel

    val hasDelivery: Boolean
        get() = this is Delivery || this is DeliveryNoParcel ||
                this is DrawDelivery || this is DrawDeliveryParcel
}
```

### DisplayStatus Types

```kotlin
sealed class DisplayStatus {
    abstract val label: String
    abstract val color: StatusColor

    // Primary statuses
    data class Redeemed(override val label: String) : DisplayStatus()
    data class Used(override val label: String) : DisplayStatus()
    data class Expired(override val label: String) : DisplayStatus()
    
    // Draw statuses
    data class DrawWaiting(override val label: String) : DisplayStatus()
    data class DrawWinner(override val label: String, val privilege: PrivilegeContent?) : DisplayStatus()
    data class DrawNotWinner(override val label: String) : DisplayStatus()

    // Helper properties
    val isDraw: Boolean
        get() = this is DrawWaiting || this is DrawWinner || this is DrawNotWinner

    val privilegeContent: PrivilegeContent?
        get() = (this as? DrawWinner)?.privilege
}
```

### DeliveryStatus Types

```kotlin
sealed class DeliveryStatus {
    abstract val label: String
    abstract val color: StatusColor

    // Preparing for shipment
    data class Preparing(override val label: String) : DeliveryStatus()
    
    // Shipped with tracking number
    data class Shipped(override val label: String, val tracking: String) : DeliveryStatus()

    // Helper properties
    val trackingNo: String?
        get() = (this as? Shipped)?.tracking?.ifEmpty { null }

    val canCopyTracking: Boolean
        get() = !trackingNo.isNullOrEmpty()
}
```

### StatusColor Enum

```kotlin
enum class StatusColor { GREEN, GRAY, RED, ORANGE, BLUE }
```

### PrivilegeContent (For Draw Winners)

```kotlin
data class PrivilegeContent(
    val content: String,
    val type: PrivilegeContentType
)

enum class PrivilegeContentType {
    TEXT,   // Plain text message
    HTML,   // HTML content
    URL     // Clickable URL
}
```

---

## Complete Usage Example

### ViewModel

```kotlin
class HistoryViewModel : ViewModel() {
    private val historyService = BuzzebeesSDK.instance().history
    
    private val _purchases = MutableStateFlow<List<Purchase>>(emptyList())
    val purchases: StateFlow<List<Purchase>> = _purchases.asStateFlow()
    
    init {
        historyService.setConfig(HistoryConfigBuilder.thai())
    }
    
    fun loadHistory() {
        viewModelScope.launch {
            val form = HistoryForm(byConfig = true, config = "purchase", top = 20)
            when (val result = historyService.getHistory(form)) {
                is HistoryResult.SuccessList -> _purchases.value = result.result
                is HistoryResult.Error -> { /* handle error */ }
                else -> {}
            }
        }
    }
    
    /**
     * Process item when user clicks
     */
    fun processItem(purchase: Purchase, onNextStep: (HistoryNextStep) -> Unit) {
        viewModelScope.launch {
            when (val result = historyService.processRedeemAction(purchase)) {
                is HistoryResult.SuccessProcessRedeem -> onNextStep(result.nextStep)
                is HistoryResult.Error -> { /* handle error */ }
                else -> {}
            }
        }
    }
    
    /**
     * Use now after user confirms
     */
    fun confirmUse(purchase: Purchase, onShowCode: (HistoryNextStep.ShowCode) -> Unit) {
        viewModelScope.launch {
            when (val result = historyService.useNow(purchase)) {
                is HistoryResult.SuccessProcessRedeem -> {
                    (result.nextStep as? HistoryNextStep.ShowCode)?.let { onShowCode(it) }
                }
                is HistoryResult.Error -> { /* handle error */ }
                else -> {}
            }
        }
    }
}
```

### Handling Action Click

```kotlin
fun handleActionClick(purchase: Purchase, viewModel: HistoryViewModel) {
    // Use processRedeemAction when user clicks on item
    viewModel.processItem(purchase) { nextStep ->
        when (nextStep) {
            is HistoryNextStep.ShowCode -> {
                // Show code directly (already used or auto-use)
                showCodeDialog(nextStep)
            }
            is HistoryNextStep.ShowConfirmUse -> {
                // Show confirm dialog
                showConfirmDialog(
                    purchase = nextStep.purchase,
                    onConfirm = {
                        // User confirmed, call useNow()
                        viewModel.confirmUse(nextStep.purchase) { showCode ->
                            showCodeDialog(showCode)
                        }
                    },
                    onCancel = {
                        // User chose "Use Later" - do nothing
                    }
                )
            }
            is HistoryNextStep.OpenWebsite -> {
                openUrl(nextStep.url)
            }
            is HistoryNextStep.ShowTransferPointDialog -> {
                showTransferDialog(nextStep)
            }
            is HistoryNextStep.ShowInformation -> {
                showInfoDialog(nextStep.purchase)
            }
        }
    }
}
```

### Status Switch Pattern by DisplayType

```kotlin
@Composable
fun StatusAndActionView(
    purchase: Purchase,
    onActionClick: () -> Unit,
    onOpenWebsite: (url: String) -> Unit
) {
    when (val displayType = purchase.displayType) {
        is BzbsRedeemCampaignDisplayType.Purchase -> {
            // Standard purchase: Status + Action button
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            ActionButton(
                buttonLabel = purchase.buttonLabel,
                onClick = onActionClick  // Will call processRedeem()
            )
        }

        is BzbsRedeemCampaignDisplayType.Delivery -> {
            // Delivery with tracking: Status + Delivery status + Tracking (No action button)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayDeliveryStatus?.let { delivery ->
                StatusBadge(delivery.label, delivery.color)
                delivery.trackingNo?.let { CopyableTrackingNumber(it) }
            }
        }

        is BzbsRedeemCampaignDisplayType.DeliveryNoParcel -> {
            // Delivery preparing: Status + Delivery status (No action button)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayDeliveryStatus?.let { StatusBadge(it.label, it.color) }
        }

        is BzbsRedeemCampaignDisplayType.Draw -> {
            // Draw campaign: Status + Privilege content (for winners)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayStatus.privilegeContent?.let { PrivilegeContentDisplay(it, onOpenWebsite) }
            if (displayType.isWinner) {
                ActionButton(purchase.buttonLabel, onActionClick)  // Will call processRedeem()
            }
        }

        is BzbsRedeemCampaignDisplayType.DrawDelivery -> {
            // Draw winner with delivery (preparing)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayStatus.privilegeContent?.let { PrivilegeContentDisplay(it, onOpenWebsite) }
            purchase.displayDeliveryStatus?.let { StatusBadge(it.label, it.color) }
            if (displayType.isWinner) {
                ActionButton(purchase.buttonLabel, onActionClick)
            }
        }

        is BzbsRedeemCampaignDisplayType.DrawDeliveryParcel -> {
            // Draw winner with delivery (shipped with tracking)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayStatus.privilegeContent?.let { PrivilegeContentDisplay(it, onOpenWebsite) }
            purchase.displayDeliveryStatus?.let { delivery ->
                StatusBadge(delivery.label, delivery.color)
                displayType.trackingNo?.let { CopyableTrackingNumber(it) }
            }
            if (displayType.isWinner) {
                ActionButton(purchase.buttonLabel, onActionClick)
            }
        }

        is BzbsRedeemCampaignDisplayType.Interface -> {
            // Interface campaign: Status + Action button (web/sticker/transfer)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            ActionButton(
                buttonLabel = purchase.buttonLabel,
                onClick = onActionClick  // Will call processRedeem()
            )
        }

        is BzbsRedeemCampaignDisplayType.Message -> {
            // Message only: Status (no action)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
        }

        is BzbsRedeemCampaignDisplayType.Expired -> {
            // Expired: Status only
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
        }
    }
}
```

### Shared Components

```kotlin
@Composable
fun StatusBadge(label: String, color: StatusColor) {
    val (bgColor, textColor) = when (color) {
        StatusColor.GREEN -> Color(0xFFE8F5E9) to Color(0xFF2E7D32)
        StatusColor.GRAY -> Color(0xFFF5F5F5) to Color(0xFF616161)
        StatusColor.RED -> Color(0xFFFFEBEE) to Color(0xFFC62828)
        StatusColor.ORANGE -> Color(0xFFFFF3E0) to Color(0xFFE65100)
        StatusColor.BLUE -> Color(0xFFE3F2FD) to Color(0xFF1565C0)
    }
    Box(modifier = Modifier.background(bgColor, RoundedCornerShape(4.dp)).padding(horizontal = 8.dp, vertical = 2.dp)) {
        Text(text = label, color = textColor, style = MaterialTheme.typography.labelSmall)
    }
}

@Composable
fun ActionButton(
    buttonLabel: String?,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
    ) {
        Text(buttonLabel ?: "")
    }
}
```

---

## Status Decision Flow

### Campaign Type Routing

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Check Expired First                                      │
│    → voucherExpireDate < now OR expireIn < 0                │
│    → displayType: Expired                                   │
│    → displayStatus: Expired(config.statusExpired)           │
│    → buttonLabel: null                                      │
├─────────────────────────────────────────────────────────────┤
│ 2. Check Delivery Flag                                      │
│    → delivered == true → resolveDeliveryCampaign()          │
├─────────────────────────────────────────────────────────────┤
│ 3. Route by Campaign Type                                   │
│    → DRAW (type = 0) → resolveDrawCampaign()                │
│    → FREE/DEAL (type = 1, 2) → resolveStandardCampaign()    │
│    → INTERFACE (type = 3) → resolveInterfaceCampaign()      │
│    → DONATE (type = 4) → resolveNoActionCampaign()          │
└─────────────────────────────────────────────────────────────┘
```

### Standard Campaign (FREE/DEAL) - processRedeemAction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ User clicks → processRedeemAction() → Fetch Inquiry API         │
├─────────────────────────────────────────────────────────────────┤
│ IsNotAutoUse = true (ไม่ Auto Use)                              │
│   ├─ IsRequireUniqueSerial = true  → ShowCode                   │
│   └─ IsRequireUniqueSerial = false                              │
│       ├─ IsUsed = true  → ShowCode                              │
│       └─ IsUsed = false → ShowConfirmUse                        │
├─────────────────────────────────────────────────────────────────┤
│ IsNotAutoUse = false (Auto Use)                                 │
│   ├─ IsUsed = true  → ShowCode                                  │
│   └─ IsUsed = false → ShowConfirmUse                            │
└─────────────────────────────────────────────────────────────────┘
```

### Draw Campaign (Only Winners Can Click)

```
┌──────────────────────────────────────────────────────────────────────┐
│ hasWinner && isWinner                                                │
│   → displayStatus: DrawWinner(config.drawStatusWinner, privilege)    │
│   → displayType: Draw(isWinner = true)  ← Winner can click           │
│   → buttonLabel: config.buttonShowInfo                               │
│   → processRedeemAction() → ShowInformation                          │
├──────────────────────────────────────────────────────────────────────┤
│ hasWinner && !isWinner                                               │
│   → displayStatus: DrawNotWinner(config.drawStatusNotWinner)         │
│   → displayType: Draw(isWinner = false) ← Not winner, cannot click   │
│   → buttonLabel: null                                                │
├──────────────────────────────────────────────────────────────────────┤
│ !hasWinner                                                           │
│   → displayStatus: DrawWaiting(config.drawStatusWaiting)             │
│   → displayType: Draw(isWinner = false) ← Waiting, cannot click      │
│   → buttonLabel: null                                                │
└──────────────────────────────────────────────────────────────────────┘
```

### Delivery Item (No Action Button)

Delivery items only show status and tracking information. **No action button is available.**

```
┌──────────────────────────────────────────────────────────────────────┐
│ isShipped == true                                                    │
│   → displayStatus: Redeemed(config.statusRedeemed)                   │
│   → displayDeliveryStatus: Shipped(config.deliveryStatusShipped, no) │
│   → displayType: Delivery(trackingNo)   ← No action                  │
│   → buttonLabel: null                                                │
├──────────────────────────────────────────────────────────────────────┤
│ isShipped == false                                                   │
│   → displayStatus: Redeemed(config.statusRedeemed)                   │
│   → displayDeliveryStatus: Preparing(config.deliveryStatusPreparing) │
│   → displayType: DeliveryNoParcel       ← No action                  │
│   → buttonLabel: null                                                │
└──────────────────────────────────────────────────────────────────────┘
```

### Interface Campaign - processRedeemAction Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│ User clicks → processRedeemAction()                                  │
├──────────────────────────────────────────────────────────────────────┤
│ LINE Sticker (website contains "linesticker")                        │
│   → OpenWebsite(url)                                                 │
├──────────────────────────────────────────────────────────────────────┤
│ Transfer Point (website contains "the1" / "truepoint" / "theone")    │
│   → ShowTransferPointDialog(...)                                     │
├──────────────────────────────────────────────────────────────────────┤
│ Garena / TrueMoney / Starbucks / Other Website                       │
│   → OpenWebsite(url)                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Summary

The HistoryUseCase provides comprehensive purchase and redemption history management functionality within the Buzzebees SDK.

**Key Features:**

- **`setConfig()` method** - Configure all display texts once, use everywhere
- **`useRedeem()` method** - Direct use API call to activate code
- **`processRedeem()` method** - Get inquiry data for a redeem key
- **`processRedeemAction()` method** - Determine next action when user clicks
- **`useNow()` method** - Convenience method combining use + inquiry
- **Structured Display Type System** - `BzbsRedeemCampaignDisplayType` determines UI behavior
- **Pre-computed Display Fields** - Status labels, button labels use configured texts
- **Next Step Actions** - Clear result types (ShowCode, ShowConfirmUse, OpenWebsite, ShowTransferPointDialog, ShowInformation)
- **Delivery Tracking** - Built-in delivery status and tracking number support
- **Draw Campaign Support** - Winner/loser status with privilege content display (TEXT/HTML/URL)
- **Winner-Only Click** - Only draw winners can click to see privilege content

**Architecture Highlights:**

- `getHistory()` returns list with display data (but some fields may be incorrect)
- `useRedeem()` calls use API and returns `UseCampaignResponse` with `ShowCode`
- `processRedeem()` gets inquiry data and returns updated `Purchase`
- `processRedeemAction()` determines next action and returns `HistoryNextStep`
- `useNow()` combines use + inquiry, returns `Purchase` with `ShowCode`
- `displayType` determines what UI to show and whether item can be clicked
- `displayStatus` provides the primary status badge (Redeemed, Used, Expired, Draw states)
- `displayDeliveryStatus` provides secondary delivery badge (Preparing, Shipped)
- `buttonLabel` is set by SDK based on campaign type and website (from config)

**Method Usage Pattern:**

| Scenario | Method to Use |
|----------|---------------|
| Load history list | `getHistory()` |
| User clicks on item | `processRedeemAction()` |
| User confirms "Use Now" | `useNow()` |
| Direct use API call | `useRedeem()` |
| Get inquiry data | `processRedeem()` |
| Get delivery address | `getRedeemAddress()` |

**Direct Access Pattern:**

| Data Needed | Access Pattern |
|-------------|----------------|
| Can click? | `purchase.displayType.canClick` |
| Status label | `purchase.displayStatus.label` |
| Status color | `purchase.displayStatus.color` |
| Is draw? | `purchase.displayType.isDraw` |
| Has delivery? | `purchase.displayType.hasDelivery` |
| Tracking number | `purchase.displayDeliveryStatus?.trackingNo` |
| Privilege content | `purchase.displayStatus.privilegeContent` |
| Button label | `purchase.buttonLabel` |

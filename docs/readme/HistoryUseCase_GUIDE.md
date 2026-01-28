# HistoryUseCase Guide

This guide shows how to initialize and use every public method in `HistoryUseCase`, with suspend and callback examples where available. The HistoryUseCase provides comprehensive history management functionality for retrieving user purchase history and using redeemed campaigns.

## Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Core Methods](#core-methods)
  - [getHistory](#gethistory)
  - [use](#use)
  - [getInquiryHistory](#getinquiryhistory)
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
// 1. Set display texts once at initialization
historyService.setDisplayTexts(HistoryExtractorConfig.THAI)

// 2. Use methods without worrying about localization
val result = historyService.getHistory(form)
val useResult = historyService.use(purchase)
```

---

## Configuration

### setDisplayTexts

Set display texts configuration once at initialization. After setting, all status messages, button labels, and error messages will use these texts automatically.

#### Method Signature

```kotlin
fun setDisplayTexts(config: HistoryExtractorConfig)
fun getDisplayTexts(): HistoryExtractorConfig
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
HistoryExtractorConfig.DEFAULT

// Thai
HistoryExtractorConfig.THAI
```

#### Usage Examples

```kotlin
// Option 1: Use Thai language
historyService.setDisplayTexts(HistoryExtractorConfig.THAI)

// Option 2: Use English (default)
historyService.setDisplayTexts(HistoryExtractorConfig.DEFAULT)

// Option 3: Custom some texts
historyService.setDisplayTexts(
    HistoryExtractorConfig.THAI.copy(
        statusExpired = "สิทธิ์หมดอายุแล้ว"
    )
)

// Get current configuration
val currentConfig = historyService.getDisplayTexts()
```

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
        
        // Set display texts for history service
        BuzzebeesSDK.instance().history.setDisplayTexts(HistoryExtractorConfig.THAI)
    }
}

// Example: On language change
fun onLanguageChanged(locale: String) {
    val config = if (locale == "th") {
        HistoryExtractorConfig.THAI
    } else {
        HistoryExtractorConfig.DEFAULT
    }
    BuzzebeesSDK.instance().history.setDisplayTexts(config)
}
```

---

## Core Methods

### getHistory

Retrieves the user's purchase and redemption history with filtering and pagination options. Uses display texts from `setDisplayTexts()` configuration.

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
historyService.setDisplayTexts(HistoryExtractorConfig.THAI)

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
            println("Action Type: ${purchase.displayType.action}")
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

### use

Uses a redeemed campaign or voucher. Call this when user clicks the action button. Uses display texts from `setDisplayTexts()` configuration for error messages.

#### Request Parameters

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|-----------|
| purchase | Purchase object from history | M | Purchase |

#### Response

Returns `HistoryResult` which is either:
- `HistoryResult.SuccessUse` - Contains `purchase` and `nextStep`
- `HistoryResult.Error` - Contains error information (uses configured error messages)

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
    
    /**
     * Show privilege content for draw winners (no API call).
     */
    data class ShowInformation(val purchase: Purchase) : HistoryNextStep()
}
```

#### Usage Example

```kotlin
// Suspend
val result = historyService.use(purchase)

when (result) {
    is HistoryResult.SuccessUse -> {
        when (val nextStep = result.nextStep) {
            is HistoryNextStep.ShowCode -> {
                showCodeDialog(
                    code = nextStep.code,
                    barcode = nextStep.barcode,
                    hasCountdown = nextStep.hasCountdown,
                    countdownSeconds = nextStep.countdownSeconds,
                    redeemDate = nextStep.redeemDate
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
        // Error message uses configured text
        showError(result.error.error?.message)
    }
    else -> {}
}

// Callback
historyService.use(purchase) { result ->
    when (result) {
        is HistoryResult.SuccessUse -> handleNextStep(result.nextStep)
        is HistoryResult.Error -> showError(result.error.error?.message)
        else -> {}
    }
}
```

---

### getInquiryHistory

Retrieves detailed inquiry information for a specific redemption.

#### Request Parameters

| Field Name | Description | Mandatory | Data Type |
|------------|-------------|-----------|-----------|
| redeemKey | Unique redemption key from purchase | M | String |

#### Response

Returns `HistoryResult.SuccessInquiryHistory` with detailed `Purchase` data including serial, barcode, and expiration info.

#### Usage Example

```kotlin
// Suspend
val result = historyService.getInquiryHistory(redeemKey = "redeem_key_12345")

when (result) {
    is HistoryResult.SuccessInquiryHistory -> {
        val purchase = result.result
        println("Serial: ${purchase.serial}")
        println("Barcode: ${purchase.barcode}")
        println("Expire In: ${purchase.expireIn}")
    }
    is HistoryResult.Error -> {
        showError(result.error.error?.message)
    }
    else -> {}
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

### Computed Display Fields (Auto-populated by SDK)

These fields are automatically computed using the configured `HistoryExtractorConfig`:

| Field Name | Description | Data Type |
|------------|-------------|-----------|
| displayType | Campaign display type with action | BzbsRedeemCampaignDisplayType |
| displayStatus | Primary status (uses config texts) | DisplayStatus |
| displayDeliveryStatus | Delivery status (optional) | DeliveryStatus? |
| displayMessage | Formatted display message | String? |
| displayFullImageUrl | Full image URL with CDN | String? |
| displayPoint | Formatted point display | String? |
| displayDate | Formatted date display | String? |
| buttonLabel | Button text (from config, based on actionType) | String? |

### Accessing Display Data (Direct Access Pattern)

All display data is accessed directly from the normalized fields. No convenience accessors are provided - access properties directly from the display objects:

| Data Needed | Access Pattern |
|-------------|----------------|
| Can click? | `purchase.displayType.canClick` |
| Action type | `purchase.displayType.action` |
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
    // Show action button
}

// Get action type for routing
when (purchase.displayType.action) {
    RedeemActionType.CONFIRM_USE -> showConfirmDialog()
    RedeemActionType.VIEW_CODE -> callUseApi()
    RedeemActionType.OPEN_WEBSITE -> callUseApi()
    RedeemActionType.TRANSFER_POINT -> callUseApi()
    RedeemActionType.SHOW_INFO -> callUseApi() // For draw winners
    null -> { /* No action available */ }
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

The `displayType` field determines the overall display behavior and action:

```kotlin
sealed class BzbsRedeemCampaignDisplayType : Parcelable {
    abstract val canClick: Boolean

    // Standard purchase with action button
    data class Purchase(val actionType: RedeemActionType) : BzbsRedeemCampaignDisplayType()
    
    // Delivery item with tracking
    data class Delivery(val actionType: RedeemActionType? = null) : BzbsRedeemCampaignDisplayType()
    
    // Delivery item without tracking yet
    data class DeliveryNoParcel(val actionType: RedeemActionType? = null) : BzbsRedeemCampaignDisplayType()
    
    // Draw campaign (only winners can click)
    data class Draw(val actionType: RedeemActionType? = null) : BzbsRedeemCampaignDisplayType()
    
    // Draw winner with delivery (preparing)
    data class DrawDelivery(val actionType: RedeemActionType? = null) : BzbsRedeemCampaignDisplayType()
    
    // Draw winner with delivery (shipped with tracking)
    data class DrawDeliveryParcel(
        val trackingNo: String? = null,
        val actionType: RedeemActionType? = null
    ) : BzbsRedeemCampaignDisplayType()
    
    // Interface campaign (web-based actions)
    data class Interface(val actionType: RedeemActionType) : BzbsRedeemCampaignDisplayType()
    
    // Message only (no action)
    data class Message(val privilegeContent: PrivilegeContent? = null) : BzbsRedeemCampaignDisplayType()
    
    // Expired item
    data object Expired : BzbsRedeemCampaignDisplayType()

    // Helper properties
    val action: RedeemActionType?
        get() = when (this) {
            is Purchase -> actionType
            is Delivery -> actionType
            is DeliveryNoParcel -> actionType
            is Interface -> actionType
            is Draw -> actionType
            is DrawDelivery -> actionType
            is DrawDeliveryParcel -> actionType
            else -> null
        }

    val isDraw: Boolean
        get() = this is Draw || this is DrawDelivery || this is DrawDeliveryParcel

    val hasDelivery: Boolean
        get() = this is Delivery || this is DeliveryNoParcel ||
                this is DrawDelivery || this is DrawDeliveryParcel
}
```

### RedeemActionType Enum

Action types determine what happens when user clicks. Button labels are stored separately in `Purchase.buttonLabel`:

```kotlin
enum class RedeemActionType {
    /** View code (used or auto-use) */
    VIEW_CODE,
    
    /** Confirm before use */
    CONFIRM_USE,
    
    /** Open website (LINE Sticker, Garena, TrueMoney, Starbucks) */
    OPEN_WEBSITE,
    
    /** Transfer points (The1, TruePoint) */
    TRANSFER_POINT,
    
    /**
     * Show privilege content for draw winners (no API call).
     */
    SHOW_INFO
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
        historyService.setDisplayTexts(HistoryExtractorConfig.THAI)
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
    
    fun usePurchase(purchase: Purchase, onNextStep: (HistoryNextStep) -> Unit) {
        viewModelScope.launch {
            when (val result = historyService.use(purchase)) {
                is HistoryResult.SuccessUse -> onNextStep(result.nextStep)
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
    when (purchase.displayType.action) {
        RedeemActionType.CONFIRM_USE -> showConfirmDialog(purchase)
        RedeemActionType.VIEW_CODE,
        RedeemActionType.OPEN_WEBSITE,
        RedeemActionType.TRANSFER_POINT,
        RedeemActionType.SHOW_INFO -> {
            viewModel.usePurchase(purchase) { nextStep ->
                when (nextStep) {
                    is HistoryNextStep.ShowCode -> showCodeDialog(nextStep)
                    is HistoryNextStep.OpenWebsite -> openUrl(nextStep.url)
                    is HistoryNextStep.ShowTransferPointDialog -> showTransferDialog(nextStep)
                    is HistoryNextStep.ShowInformation -> showInfoDialog(nextStep)
                }
            }
        }
        null -> {
            // No action - maybe copy tracking number for delivery items
            purchase.displayDeliveryStatus?.trackingNo?.let { copyToClipboard(it) }
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
                actionType = displayType.actionType,
                buttonLabel = purchase.buttonLabel,
                isUsed = purchase.isUsed == true,
                onClick = onActionClick
            )
        }

        is BzbsRedeemCampaignDisplayType.Delivery -> {
            // Delivery with tracking: Status + Delivery status + Tracking (No action button)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayDeliveryStatus?.let { delivery ->
                StatusBadge(delivery.label, delivery.color)
                delivery.trackingNo?.let { CopyableTrackingNumber(it) }
            }
            // No action button for delivery items
        }

        is BzbsRedeemCampaignDisplayType.DeliveryNoParcel -> {
            // Delivery preparing: Status + Delivery status (No action button)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayDeliveryStatus?.let { StatusBadge(it.label, it.color) }
            // No action button for delivery items
        }

        is BzbsRedeemCampaignDisplayType.Draw -> {
            // Draw campaign: Status + Privilege content (for winners)
            // Only winners can click (actionType = SHOW_INFO)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayStatus.privilegeContent?.let { PrivilegeContentDisplay(it, onOpenWebsite) }
            displayType.actionType?.let {
                ActionButton(it, purchase.buttonLabel, false, onActionClick)
            }
        }

        is BzbsRedeemCampaignDisplayType.DrawDelivery -> {
            // Draw winner with delivery (preparing)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            purchase.displayStatus.privilegeContent?.let { PrivilegeContentDisplay(it, onOpenWebsite) }
            purchase.displayDeliveryStatus?.let { StatusBadge(it.label, it.color) }
            displayType.actionType?.let {
                ActionButton(it, purchase.buttonLabel, false, onActionClick)
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
            displayType.actionType?.let {
                ActionButton(it, purchase.buttonLabel, false, onActionClick)
            }
        }

        is BzbsRedeemCampaignDisplayType.Interface -> {
            // Interface campaign: Status + Action button (web/sticker/transfer)
            StatusBadge(purchase.displayStatus.label, purchase.displayStatus.color)
            ActionButton(
                actionType = displayType.actionType,
                buttonLabel = purchase.buttonLabel,
                isUsed = purchase.isUsed == true,
                onClick = onActionClick
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
    actionType: RedeemActionType,
    buttonLabel: String?,
    isUsed: Boolean,
    onClick: () -> Unit
) {
    val buttonColor = when (actionType) {
        RedeemActionType.CONFIRM_USE -> MaterialTheme.colorScheme.primary
        RedeemActionType.VIEW_CODE -> if (isUsed) Color(0xFF757575) else Color(0xFF4CAF50)
        RedeemActionType.OPEN_WEBSITE -> Color(0xFF2196F3)
        RedeemActionType.TRANSFER_POINT -> Color(0xFF9C27B0)
        RedeemActionType.SHOW_INFO -> Color(0xFF009688)
    }

    Button(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = ButtonDefaults.buttonColors(containerColor = buttonColor)
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

### Standard Campaign (FREE/DEAL)

```
┌─────────────────────────────────────────────────────────────────┐
│ isUsed == true                                                  │
│   → displayStatus: Used(config.statusUsed)                      │
│   → displayType: Purchase(VIEW_CODE)                            │
│   → buttonLabel: config.buttonViewCode                          │
├─────────────────────────────────────────────────────────────────┤
│ isUsed == false && isAutoUse                                    │
│   → displayStatus: Redeemed(config.statusRedeemed)              │
│   → displayType: Purchase(VIEW_CODE)                            │
│   → buttonLabel: config.buttonViewCode                          │
├─────────────────────────────────────────────────────────────────┤
│ isUsed == false && !isAutoUse                                   │
│   → displayStatus: Redeemed(config.statusRedeemed)              │
│   → displayType: Purchase(CONFIRM_USE)                          │
│   → buttonLabel: config.buttonConfirmUse                        │
└─────────────────────────────────────────────────────────────────┘
```

### Draw Campaign (Only Winners Can Click)

```
┌──────────────────────────────────────────────────────────────────────┐
│ hasWinner && isWinner                                                │
│   → displayStatus: DrawWinner(config.drawStatusWinner, privilege)    │
│   → displayType: Draw(SHOW_INFO)     ← Winner can click              │
│   → buttonLabel: config.buttonShowInfo                               │
├──────────────────────────────────────────────────────────────────────┤
│ hasWinner && !isWinner                                               │
│   → displayStatus: DrawNotWinner(config.drawStatusNotWinner)         │
│   → displayType: Draw(null)          ← Not winner, cannot click      │
│   → buttonLabel: null                                                │
├──────────────────────────────────────────────────────────────────────┤
│ !hasWinner                                                           │
│   → displayStatus: DrawWaiting(config.drawStatusWaiting)             │
│   → displayType: Draw(null)          ← Waiting, cannot click         │
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
│   → displayType: Delivery(null)      ← No action                     │
│   → buttonLabel: null                                                │
├──────────────────────────────────────────────────────────────────────┤
│ isShipped == false                                                   │
│   → displayStatus: Redeemed(config.statusRedeemed)                   │
│   → displayDeliveryStatus: Preparing(config.deliveryStatusPreparing) │
│   → displayType: DeliveryNoParcel(null)  ← No action                 │
│   → buttonLabel: null                                                │
└──────────────────────────────────────────────────────────────────────┘
```

### Draw with Delivery (Only Winners Can Click)

```
┌──────────────────────────────────────────────────────────────────────┐
│ isWinner && isShipped && parcelNo exists                             │
│   → displayStatus: DrawWinner(config.drawStatusWinner, privilege)    │
│   → displayDeliveryStatus: Shipped(config.deliveryStatusShipped, no) │
│   → displayType: DrawDeliveryParcel(parcelNo, SHOW_INFO)             │
│   → buttonLabel: config.buttonShowInfo                               │
├──────────────────────────────────────────────────────────────────────┤
│ isWinner && !isShipped                                               │
│   → displayStatus: DrawWinner(config.drawStatusWinner, privilege)    │
│   → displayDeliveryStatus: Preparing(config.deliveryStatusPreparing) │
│   → displayType: DrawDelivery(SHOW_INFO)                             │
│   → buttonLabel: config.buttonShowInfo                               │
├──────────────────────────────────────────────────────────────────────┤
│ !isWinner                                                            │
│   → displayStatus: DrawNotWinner/DrawWaiting                         │
│   → displayDeliveryStatus: null                                      │
│   → displayType: Draw(null)          ← Not winner, cannot click      │
│   → buttonLabel: null                                                │
└──────────────────────────────────────────────────────────────────────┘
```

### Interface Campaign

```
┌──────────────────────────────────────────────────────────────────────┐
│ Survey completed (interfaceDisplay == "survey" && pointType == "use")│
│   → displayStatus: Used(config.statusUsed)                           │
│   → displayType: Message(null)                                       │
│   → buttonLabel: null                                                │
├──────────────────────────────────────────────────────────────────────┤
│ isUsed == true                                                       │
│   → displayStatus: Used(config.statusUsed)                           │
│   → displayType: Message(null)                                       │
│   → buttonLabel: null                                                │
├──────────────────────────────────────────────────────────────────────┤
│ LINE Sticker (website contains "linesticker")                        │
│   → displayStatus: Redeemed(config.statusRedeemed)                   │
│   → displayType: Interface(OPEN_WEBSITE)                             │
│   → buttonLabel: config.buttonDownloadSticker                        │
├──────────────────────────────────────────────────────────────────────┤
│ Transfer Point (website contains "the1" / "truepoint" / "theone")    │
│   → displayStatus: Redeemed(config.statusRedeemed)                   │
│   → displayType: Interface(TRANSFER_POINT)                           │
│   → buttonLabel: config.buttonTransferPoint                          │
├──────────────────────────────────────────────────────────────────────┤
│ Garena / TrueMoney / Starbucks / Other Website                       │
│   → displayStatus: Redeemed(config.statusRedeemed)                   │
│   → displayType: Interface(OPEN_WEBSITE)                             │
│   → buttonLabel: config.buttonOpenWebsite                            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Summary

The HistoryUseCase provides comprehensive purchase and redemption history management functionality within the Buzzebees SDK.

**Key Features:**

- **`setDisplayTexts()` method** - Configure all display texts once, use everywhere
- **Structured Display Type System** - `BzbsRedeemCampaignDisplayType` determines UI behavior
- **Pre-computed Display Fields** - Status labels, button labels use configured texts
- **RedeemActionType Enum** - Simple action types (VIEW_CODE, CONFIRM_USE, OPEN_WEBSITE, TRANSFER_POINT, SHOW_INFO)
- **Separate buttonLabel** - SDK normalizes button text based on actionType + website
- **Next Step Actions** - Clear result types (ShowCode, OpenWebsite, ShowTransferPointDialog, ShowInformation)
- **Delivery Tracking** - Built-in delivery status and tracking number support
- **Draw Campaign Support** - Winner/loser status with privilege content display (TEXT/HTML/URL)
- **Winner-Only Click** - Only draw winners can click to see privilege content

**Benefits:**

- Easy localization - just change config at startup
- Consistent text across all history items
- No need to manually map status types to labels
- Type-safe action handling with sealed classes and enums
- Reduced boilerplate code in ViewModels and UI
- Clean separation: actionType (what to do) vs buttonLabel (what to show)

**Architecture Highlights:**

- `displayType` determines what UI to show and what action is available
- `displayStatus` provides the primary status badge (Redeemed, Used, Expired, Draw states)
- `displayDeliveryStatus` provides secondary delivery badge (Preparing, Shipped)
- All display data accessed directly from normalized fields (no convenience accessors)
- `buttonLabel` is set by SDK based on actionType + website (from config)
- Draw campaigns: only winners have `actionType = SHOW_INFO`, others have `null`

**Direct Access Pattern:**

| Data Needed | Access Pattern |
|-------------|----------------|
| Can click? | `purchase.displayType.canClick` |
| Action type | `purchase.displayType.action` |
| Status label | `purchase.displayStatus.label` |
| Status color | `purchase.displayStatus.color` |
| Is draw? | `purchase.displayType.isDraw` |
| Has delivery? | `purchase.displayType.hasDelivery` |
| Tracking number | `purchase.displayDeliveryStatus?.trackingNo` |
| Privilege content | `purchase.displayStatus.privilegeContent` |
| Button label | `purchase.buttonLabel` |

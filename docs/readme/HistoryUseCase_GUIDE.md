## HistoryUseCase Guide

This guide shows how to initialize and use every public method in `HistoryUseCase`, with suspend
and callback examples where available. The HistoryUseCase provides comprehensive history management
functionality for retrieving user purchase history and using redeemed campaigns.

### Getting an instance

```kotlin
val historyService = BuzzebeesSDK.instance().history
```

---

## Quick Start

```kotlin
// 1. Set display texts once at initialization
historyService.setDisplayTexts(HistoryExtractorConfig.THAI)

// 2. Use methods without worrying about localization
val result = historyService.getHistory(form)
val useResult = historyService.use(purchase)
```

---

## setDisplayTexts

Set display texts configuration once at initialization. After setting, all status messages, button labels, and error messages will use these texts automatically.

### Method Signature

```kotlin
fun setDisplayTexts(config: HistoryExtractorConfig)
fun getDisplayTexts(): HistoryExtractorConfig
```

### HistoryExtractorConfig Fields


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
| **Error Messages** | errorTokenRequired | "Token is required" | "กรุณาเข้าสู่ระบบ" |
| | errorCannotUse | "This item cannot be used" | "ไม่สามารถใช้งานรายการนี้ได้" |
| | errorNoAction | "No action available for this item" | "ไม่มีการดำเนินการสำหรับรายการนี้" |
| | errorRedeemKeyRequired | "RedeemKey is required" | "ไม่พบรหัสแลก" |
| | errorNoData | "No data" | "ไม่พบข้อมูล" |
| | errorNoUrl | "No url" | "ไม่พบลิงก์" |

### Preset Configurations

```kotlin
// English (Default)
HistoryExtractorConfig.DEFAULT

// Thai
HistoryExtractorConfig.THAI
```

### Usage Examples

```kotlin
// Option 1: Use Thai language
historyService.setDisplayTexts(HistoryExtractorConfig.THAI)

// Option 2: Use English (default)
historyService.setDisplayTexts(HistoryExtractorConfig.DEFAULT)

// Option 3: Custom some texts
historyService.setDisplayTexts(
    HistoryExtractorConfig.THAI.copy(
        buttonViewCode = "แสดงรหัส",
        buttonConfirmUse = "ใช้สิทธิ์เลย",
        statusExpired = "สิทธิ์หมดอายุแล้ว"
    )
)

// Get current configuration
val currentConfig = historyService.getDisplayTexts()
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

## getHistory

Retrieves the user's purchase and redemption history with filtering and pagination options.
Uses display texts from `setDisplayTexts()` configuration.

### Request Parameters (HistoryForm)

| Field Name | Description                                    | Mandatory | Data Type |
|------------|------------------------------------------------|-----------|-----------|
| byConfig   | Filter by configuration flag                   | O         | Boolean   |
| config     | Configuration identifier from Backoffice      | M         | String    |
| skip       | Number of records to skip for pagination      | O         | Int?      |
| top        | Maximum number of records to return            | O         | Int?      |
| locale     | User language (1054: Thai, 1033: English)     | O         | Int?      |
| startDate  | Filter start date (ISO format string)         | O         | String?   |
| endDate    | Filter end date (ISO format string)           | O         | String?   |

### Response

Returns `HistoryResult` which is either:
- `HistoryResult.SuccessList` - Contains `result: List<Purchase>` with pre-computed display fields
- `HistoryResult.Error` - Contains error information

### Usage Examples

```kotlin
// Set display texts once (typically at app startup)
historyService.setDisplayTexts(HistoryExtractorConfig.THAI)

// Create form
val historyForm = HistoryForm(
    byConfig = true,
    config = "my_app_config",
    skip = 0,
    top = 20,
    locale = 1054,
    startDate = "2024-01-01T00:00:00Z",
    endDate = "2024-12-31T23:59:59Z"
)

// Suspend
val result = historyService.getHistory(historyForm)

when (result) {
    is HistoryResult.SuccessList -> {
        result.result.forEach { purchase ->
            // Display fields are pre-computed with configured texts
            println("Name: ${purchase.displayMessage}")
            println("Status: ${purchase.displayStatus?.label}") // Uses configured text
            println("Button: ${(purchase.historyCatalog as? HistoryButtonCatalog.ConfirmButton)?.buttonName}")
        }
    }
    is HistoryResult.Error -> {
        println("Error: ${result.error.message}")
    }
}

// Callback
historyService.getHistory(historyForm) { result ->
    when (result) {
        is HistoryResult.SuccessList -> {
            adapter.submitList(result.result)
        }
        is HistoryResult.Error -> {
            showError(result.error.message)
        }
    }
}
```

---

## Purchase Entity

### Raw Fields from API

| Field Name               | Description                          | Data Type | JSON Field               |
|--------------------------|--------------------------------------|-----------|--------------------------|
| agencyName               | Agency/merchant name                 | String?   | AgencyName               |
| iD                       | Purchase/campaign identifier         | Int?      | ID                       |
| agencyID                 | Agency identifier                    | Int?      | AgencyID                 |
| name                     | Campaign/item name                   | String?   | Name                     |
| detail                   | Campaign/item details                | String?   | Detail                   |
| condition                | Usage conditions and terms           | String?   | Condition                |
| categoryID               | Category identifier                  | Int?      | CategoryID               |
| categoryName             | Category display name                | String?   | CategoryName             |
| startDate                | Campaign start date timestamp        | Long?     | StartDate                |
| expireDate               | Campaign expiration date timestamp   | Long?     | ExpireDate               |
| location                 | Physical location or store address   | String?   | Location                 |
| website                  | Campaign website URL                 | String?   | Website                  |
| discount                 | Discount amount or percentage        | Double?   | Discount                 |
| originalPrice            | Original price before discount       | Double?   | OriginalPrice            |
| pricePerUnit             | Price per unit                       | Double?   | PricePerUnit             |
| pointPerUnit             | Points required per unit             | Double?   | PointPerUnit             |
| quantity                 | Available quantity                   | Double?   | Quantity                 |
| delivered                | Delivery status flag                 | Boolean?  | Delivered                |
| type                     | Campaign type identifier             | Int?      | Type                     |
| serial                   | Serial number or voucher code        | String?   | Serial                   |
| redeemDate               | Date when redeemed                   | Long?     | RedeemDate               |
| isUsed                   | Usage status flag                    | Boolean?  | IsUsed                   |
| isWinner                 | Winner status for contests           | Boolean?  | IsWinner                 |
| isShipped                | Shipping status flag                 | Boolean?  | IsShipped                |
| hasWinner                | Contest has winner flag              | Boolean?  | HasWinner                |
| voucherExpireDate        | Voucher expiration date              | Long?     | VoucherExpireDate        |
| parcelNo                 | Parcel tracking number               | String?   | ParcelNo                 |
| expireIn                 | Minutes until expiration             | Int?      | ExpireIn                 |
| interfaceDisplay         | UI display configuration             | String?   | InterfaceDisplay         |
| pointType                | Points type identifier               | String?   | PointType                |
| privilegeMessage         | Privilege message in default lang    | String?   | PrivilegeMessage         |
| privilegeMessageFormat   | Privilege message format type        | String?   | PrivilegeMessageFormat   |
| redeemKey                | Unique redemption key                | String?   | RedeemKey                |
| fullImageUrl             | Full resolution image URL            | String?   | FullImageUrl             |

### Computed Display Fields (Auto-populated by SDK)

These fields are automatically computed using the configured `HistoryExtractorConfig`:

| Field Name                   | Description                              | Data Type               |
|------------------------------|------------------------------------------|-------------------------|
| historyCatalog               | Button type to display                   | HistoryButtonCatalog    |
| canClick                     | Whether item is clickable                | Boolean                 |
| displayMessage               | Formatted display message                | String?                 |
| displayFullImageUrl          | Full image URL with CDN                  | String?                 |
| displayPoint                 | Formatted point display                  | String?                 |
| displayStatus                | Primary status (uses config texts)       | DisplayStatus?          |
| displayDrawStatus            | Draw campaign status (uses config texts) | DisplayStatus?          |
| displayDeliveryStatus        | Delivery status (uses config texts)      | DisplayStatus?          |
| displayPrivilegeContent      | Privilege content for winners            | String?                 |
| displayPrivilegeContentType  | Content type (TEXT/HTML/URL)             | PrivilegeContentType?   |
| displayTrackingNo            | Tracking number for delivery             | String?                 |

---

## Display Status System

The SDK provides a structured status system with configurable display texts.

### DisplayStatus Structure

```kotlin
data class DisplayStatus(
    val type: DisplayStatusType,  // Use this for logic checks
    val label: String,            // Localized text from config
    val color: StatusColor
)
```

### DisplayStatusType Constants

Use these constants to check status type (not the localized label):

```kotlin
object DisplayStatusType {
    // Primary Status (displayStatus)
    const val READY = "READY"
    const val EXPIRED = "EXPIRED"
    const val USED = "USED"
    const val COMPLETED = "COMPLETED"
    const val DONATED = "DONATED"
    const val REDEEMED = "REDEEMED"
    
    // Draw Status (displayDrawStatus)
    const val DRAW_WAITING = "DRAW_WAITING"
    const val DRAW_WINNER = "DRAW_WINNER"
    const val DRAW_NOT_WINNER = "DRAW_NOT_WINNER"
    
    // Delivery Status (displayDeliveryStatus)
    const val DELIVERY_PREPARING = "DELIVERY_PREPARING"
    const val DELIVERY_SHIPPED = "DELIVERY_SHIPPED"
    const val DELIVERY_SUCCESS = "DELIVERY_SUCCESS"
}
```

### StatusColor Enum

```kotlin
enum class StatusColor { GREEN, GRAY, RED, ORANGE, BLUE }
```

### Usage Example

```kotlin
// ✅ Check status using type (recommended for logic)
when (purchase.displayStatus?.type) {
    DisplayStatusType.EXPIRED -> showExpiredUI()
    DisplayStatusType.USED -> showUsedUI()
    DisplayStatusType.REDEEMED -> showReadyUI()
}

// ✅ Display label (uses configured text)
Text(text = purchase.displayStatus?.label ?: "") // Shows "หมดอายุ" if Thai config

// ✅ Use color for styling
val backgroundColor = when (purchase.displayStatus?.color) {
    StatusColor.GREEN -> Color(0xFFE8F5E9)
    StatusColor.GRAY -> Color(0xFFF5F5F5)
    StatusColor.RED -> Color(0xFFFFEBEE)
    StatusColor.ORANGE -> Color(0xFFFFF3E0)
    StatusColor.BLUE -> Color(0xFFE3F2FD)
    null -> Color.Transparent
}
```

---

## History Button Catalog

The SDK determines the appropriate button type with configured button labels.

### HistoryButtonCatalog Types

```kotlin
sealed class HistoryButtonCatalog {
    object NoButton : HistoryButtonCatalog()
    object DrawStatus : HistoryButtonCatalog()
    object ShippingStatus : HistoryButtonCatalog()
    object DrawWithDelivery : HistoryButtonCatalog()
    data class ConfirmButton(val buttonName: String) : HistoryButtonCatalog()
    data class UseButton(val buttonName: String) : HistoryButtonCatalog()
    data class WebSiteButton(val buttonName: String) : HistoryButtonCatalog()
}
```

### Usage Example

```kotlin
@Composable
fun HistoryItemButton(purchase: Purchase, onUse: (Purchase) -> Unit) {
    when (val catalog = purchase.historyCatalog) {
        is HistoryButtonCatalog.ConfirmButton -> {
            Button(
                onClick = { onUse(purchase) },
                enabled = purchase.canClick
            ) {
                // buttonName uses configured text (e.g., "กดเพื่อใช้ที่ร้านค้า")
                Text(catalog.buttonName)
            }
        }
        
        is HistoryButtonCatalog.UseButton -> {
            Button(onClick = { onUse(purchase) }) {
                // buttonName uses configured text (e.g., "ดูโค้ด")
                Text(catalog.buttonName)
            }
        }
        
        is HistoryButtonCatalog.WebSiteButton -> {
            Button(onClick = { onUse(purchase) }) {
                // buttonName uses configured text (e.g., "ดาวน์โหลดสติกเกอร์")
                Text(catalog.buttonName)
            }
        }
        
        is HistoryButtonCatalog.DrawStatus -> {
            // Show draw status badge
            purchase.displayDrawStatus?.let { StatusBadge(it) }
        }
        
        is HistoryButtonCatalog.ShippingStatus -> {
            // Show delivery status
            purchase.displayDeliveryStatus?.let { StatusBadge(it) }
            purchase.displayTrackingNo?.let { Text("Tracking: $it") }
        }
        
        is HistoryButtonCatalog.DrawWithDelivery -> {
            Column {
                purchase.displayDrawStatus?.let { StatusBadge(it) }
                purchase.displayDeliveryStatus?.let { StatusBadge(it) }
                purchase.displayTrackingNo?.let { Text("Tracking: $it") }
            }
        }
        
        is HistoryButtonCatalog.NoButton -> {
            // Just show status, no button
        }
    }
}
```

---

## use

Uses a redeemed campaign or voucher. Call this when user clicks the action button.
Uses display texts from `setDisplayTexts()` configuration for error messages.

### Request Parameters

| Field Name | Description                     | Mandatory | Data Type |
|------------|---------------------------------|-----------|-----------|
| purchase   | Purchase object from history    | M         | Purchase  |

### Response

Returns `HistoryResult` which is either:
- `HistoryResult.SuccessUse` - Contains `purchase` and `nextStep`
- `HistoryResult.Error` - Contains error information (uses configured error messages)

### HistoryNextStep Types

```kotlin
sealed class HistoryNextStep {
    data class ShowCode(
        val code: String,
        val barcode: String?,
        val hasCountdown: Boolean,
        val countdownSeconds: Long?
    ) : HistoryNextStep()
    
    data class OpenWebsite(val url: String) : HistoryNextStep()
    
    data class ShowTransferPointDialog(
        val campaignId: String,
        val campaignName: String,
        val fullImageUrl: String,
        val pointPerUnit: Double,
        val redeemDate: Long,
        val categoryId: String,
        val transactionId: String
    ) : HistoryNextStep()
}
```

### Usage Example

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
                    countdownSeconds = nextStep.countdownSeconds
                )
            }
            is HistoryNextStep.OpenWebsite -> {
                openUrl(nextStep.url)
            }
            is HistoryNextStep.ShowTransferPointDialog -> {
                showTransferPointDialog(nextStep)
            }
        }
    }
    is HistoryResult.Error -> {
        // Error message uses configured text
        showError(result.error.message)
    }
}

// Callback
historyService.use(purchase) { result ->
    when (result) {
        is HistoryResult.SuccessUse -> handleNextStep(result.nextStep)
        is HistoryResult.Error -> showError(result.error.message)
    }
}
```

---

## getRedeemAddress

Retrieves redemption address information for delivery or pickup purposes.

### Request Parameters

| Field Name | Description                               | Mandatory | Data Type |
|------------|-------------------------------------------|-----------|-----------|
| redeemKey  | Unique redemption key from purchase       | M         | String    |
| locale     | Locale for address formatting (optional)  | O         | Int?      |

### Response

Returns `HistoryResult.SuccessRedeemAddressRaw` with raw address data.

### Usage Example

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
        showError(result.error.message)
    }
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
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    init {
        // Set display texts once
        historyService.setDisplayTexts(HistoryExtractorConfig.THAI)
    }
    
    fun loadHistory() {
        viewModelScope.launch {
            val form = HistoryForm(
                byConfig = true,
                config = "purchase",
                top = 20
            )
            
            when (val result = historyService.getHistory(form)) {
                is HistoryResult.SuccessList -> {
                    _purchases.value = result.result
                }
                is HistoryResult.Error -> {
                    _error.value = result.error.message
                }
            }
        }
    }
    
    fun usePurchase(purchase: Purchase, onNextStep: (HistoryNextStep) -> Unit) {
        viewModelScope.launch {
            when (val result = historyService.use(purchase)) {
                is HistoryResult.SuccessUse -> {
                    onNextStep(result.nextStep)
                }
                is HistoryResult.Error -> {
                    _error.value = result.error.message
                }
            }
        }
    }
}
```

### Jetpack Compose UI

```kotlin
@Composable
fun HistoryScreen(viewModel: HistoryViewModel = viewModel()) {
    val purchases by viewModel.purchases.collectAsState()
    val error by viewModel.error.collectAsState()
    
    var showCodeDialog by remember { mutableStateOf<HistoryNextStep.ShowCode?>(null) }
    
    LaunchedEffect(Unit) {
        viewModel.loadHistory()
    }
    
    LazyColumn {
        items(purchases) { purchase ->
            HistoryItem(
                purchase = purchase,
                onUse = { 
                    viewModel.usePurchase(it) { nextStep ->
                        when (nextStep) {
                            is HistoryNextStep.ShowCode -> showCodeDialog = nextStep
                            is HistoryNextStep.OpenWebsite -> openUrl(nextStep.url)
                            else -> {}
                        }
                    }
                }
            )
        }
    }
    
    showCodeDialog?.let { codeData ->
        CodeDialog(codeData) { showCodeDialog = null }
    }
}

@Composable
fun HistoryItem(purchase: Purchase, onUse: (Purchase) -> Unit) {
    Card(modifier = Modifier.padding(8.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Image
            AsyncImage(
                model = purchase.displayFullImageUrl,
                contentDescription = null,
                modifier = Modifier.size(80.dp)
            )
            
            // Name
            Text(
                text = purchase.displayMessage ?: purchase.name ?: "",
                style = MaterialTheme.typography.titleMedium
            )
            
            // Points
            purchase.displayPoint?.let {
                Text(text = it, color = MaterialTheme.colorScheme.primary)
            }
            
            // Status badge (uses configured text)
            purchase.displayStatus?.let { status ->
                StatusBadge(
                    text = status.label,  // Configured text
                    color = status.color
                )
            }
            
            // Button (uses configured button name)
            when (val catalog = purchase.historyCatalog) {
                is HistoryButtonCatalog.ConfirmButton -> {
                    Button(
                        onClick = { onUse(purchase) },
                        enabled = purchase.canClick
                    ) {
                        Text(catalog.buttonName) // Configured text
                    }
                }
                is HistoryButtonCatalog.UseButton -> {
                    Button(onClick = { onUse(purchase) }) {
                        Text(catalog.buttonName) // Configured text
                    }
                }
                // ... other catalog types
                else -> {}
            }
        }
    }
}

@Composable
fun StatusBadge(text: String, color: StatusColor) {
    val (bgColor, textColor) = when (color) {
        StatusColor.GREEN -> Color(0xFFE8F5E9) to Color(0xFF2E7D32)
        StatusColor.GRAY -> Color(0xFFF5F5F5) to Color(0xFF616161)
        StatusColor.RED -> Color(0xFFFFEBEE) to Color(0xFFC62828)
        StatusColor.ORANGE -> Color(0xFFFFF3E0) to Color(0xFFE65100)
        StatusColor.BLUE -> Color(0xFFE3F2FD) to Color(0xFF1565C0)
    }
    
    Box(
        modifier = Modifier
            .background(bgColor, RoundedCornerShape(4.dp))
            .padding(horizontal = 8.dp, vertical = 2.dp)
    ) {
        Text(text, color = textColor, style = MaterialTheme.typography.labelSmall)
    }
}
```

---

## Status Decision Flow

### Standard Campaign (FREE, DEAL)

```
┌─────────────────────────────────────────────────────────────────┐
│ voucherExpireDate < now OR expireIn < 0                         │
│   → displayStatus: EXPIRED (config.statusExpired)               │
│   → historyCatalog: NoButton                                    │
│   → canClick: false                                             │
├─────────────────────────────────────────────────────────────────┤
│ isUsed == true                                                  │
│   → displayStatus: USED (config.statusUsed)                     │
│   → historyCatalog: UseButton(config.buttonViewCode)            │
│   → canClick: true                                              │
├─────────────────────────────────────────────────────────────────┤
│ isUsed == false                                                 │
│   → displayStatus: REDEEMED (config.statusRedeemed)             │
│   → historyCatalog: ConfirmButton(config.buttonConfirmUse)      │
│   → canClick: true                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Draw Campaign

```
┌──────────────────────────────────────────────────────────────────────┐
│ hasWinner && isWinner                                                │
│   → displayDrawStatus: DRAW_WINNER (config.drawStatusWinner)         │
│   → displayPrivilegeContent: privilegeMessage                        │
│   → displayPrivilegeContentType: TEXT / HTML / URL                   │
├──────────────────────────────────────────────────────────────────────┤
│ hasWinner && !isWinner                                               │
│   → displayDrawStatus: DRAW_NOT_WINNER (config.drawStatusNotWinner)  │
├──────────────────────────────────────────────────────────────────────┤
│ !hasWinner                                                           │
│   → displayDrawStatus: DRAW_WAITING (config.drawStatusWaiting)       │
└──────────────────────────────────────────────────────────────────────┘
```

### Delivery Item

```
┌──────────────────────────────────────────────────────────────────────┐
│ isShipped && hasParcelNo                                             │
│   → displayDeliveryStatus: DELIVERY_SUCCESS (config.deliveryStatus   │
│     Success)                                                         │
│   → displayTrackingNo: parcelNo                                      │
├──────────────────────────────────────────────────────────────────────┤
│ isShipped && !hasParcelNo                                            │
│   → displayDeliveryStatus: DELIVERY_SHIPPED (config.deliveryStatus   │
│     Shipped)                                                         │
├──────────────────────────────────────────────────────────────────────┤
│ !isShipped                                                           │
│   → displayDeliveryStatus: DELIVERY_PREPARING (config.deliveryStatus │
│     Preparing)                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Summary

The HistoryUseCase provides comprehensive purchase and redemption history management functionality within the Buzzebees SDK.

**Key Features:**
- **`setDisplayTexts()` method** - Configure all display texts once, use everywhere
- **Structured Status System** - Use `DisplayStatusType` constants for logic, `label` for display
- **Pre-computed Display Fields** - Status labels, button names use configured texts
- **Button Catalog** - Pre-determined button types with configurable labels
- **Next Step Actions** - Clear action types (ShowCode, OpenWebsite, ShowTransferPointDialog)
- **Delivery Tracking** - Built-in delivery status and tracking number support
- **Draw Campaign Support** - Winner/loser status with privilege content display

**Benefits:**
- Easy localization - just change config at startup
- Consistent text across all history items
- No need to manually map status types to labels
- Type-safe status checking with `DisplayStatusType` constants
- Reduced boilerplate code in ViewModels and UI

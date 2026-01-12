## PointLogUseCase Guide

This guide shows how to initialize and use every public method in `PointLogUseCase`, with suspend
and callback examples where available. The PointLogUseCase provides point transaction history
functionality for retrieving user point earning and spending logs.

### Getting an instance

```kotlin
val pointLogService = BuzzebeesSDK.instance().pointLog
```

---

## Quick Start

```kotlin
// 1. Set display texts once at initialization
pointLogService.setDisplayTexts(PointLogExtractorConfig.THAI)

// 2. Use methods without passing config every time
val result = pointLogService.getPointLog(
    month = "2025-01",
    type = "earn"
)
```

---

## setDisplayTexts

Set display texts configuration once at initialization. After setting, all methods will use these texts automatically.

### Method Signature

```kotlin
fun setDisplayTexts(config: PointLogExtractorConfig)
fun getDisplayTexts(): PointLogExtractorConfig
```

### Usage Examples

```kotlin
// Option 1: Use Thai language
pointLogService.setDisplayTexts(PointLogExtractorConfig.THAI)

// Option 2: Use English (default)
pointLogService.setDisplayTexts(PointLogExtractorConfig.DEFAULT)

// Option 3: Custom some texts
pointLogService.setDisplayTexts(
    PointLogExtractorConfig.THAI.copy(
        defaultMessageEarn = "คุณได้รับแต้มสะสม",
        welcomePointMessage = "ยินดีต้อนรับสมาชิกใหม่"
    )
)

// Get current configuration
val currentConfig = pointLogService.getDisplayTexts()
```

### When to Call

- **At app startup** - Set once in Application class or main Activity
- **On language change** - Update when user changes app language
- **Before first API call** - Must be set before calling `getPointLog()`

```kotlin
// Example: In Application class
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize SDK
        BuzzebeesSDK.init(this, config)
        
        // Set display texts for all services
        BuzzebeesSDK.instance().pointLog.setDisplayTexts(PointLogExtractorConfig.THAI)
    }
}

// Example: On language change
fun onLanguageChanged(locale: String) {
    val config = if (locale == "th") {
        PointLogExtractorConfig.THAI
    } else {
        PointLogExtractorConfig.DEFAULT
    }
    BuzzebeesSDK.instance().pointLog.setDisplayTexts(config)
}
```

---

## getPointLog

Retrieves point transaction logs filtered by month and type with pagination support.
**The SDK automatically extracts and formats display messages** from various formats (JSON, trace data, plain text).

### Request Parameters

| Field Name      | Description                              | Mandatory | Data Type              |
|-----------------|------------------------------------------|-----------|------------------------|
| month           | Month filter (YYYY-MM format)            | M         | String                 |
| type            | Transaction type filter                  | M         | String                 |
| lastRowKey      | Last row key for pagination              | O         | String?                |

### Response

Returns `PointLogResult` which is either:
- `PointLogResult.Success` - Contains `items: List<PointLogDisplayItem>` and `rawData: List<PointLog>`
- `PointLogResult.Error` - Contains error information

### Usage Examples

#### Basic Usage (Suspend)

```kotlin
// Set display texts once (typically at app startup)
pointLogService.setDisplayTexts(PointLogExtractorConfig.THAI)

// Then use without passing config
val result = pointLogService.getPointLog(
    month = "2025-01",
    type = "earn"
)

when (result) {
    is PointLogResult.Success -> {
        result.items.forEach { item ->
            // ✅ Use displayMessage directly - no parsing needed!
            println("Message: ${item.displayMessage}")
            println("Points: ${item.points}")
            println("Source: ${item.messageSource}")
            
            // Access image if available
            item.imageUrl?.let { url ->
                println("Image: $url")
            }
        }
    }
    is PointLogResult.Error -> {
        println("Error: ${result.error.message}")
    }
}
```

#### Callback Version

```kotlin
pointLogService.getPointLog(
    month = "2025-01",
    type = "earn"
) { result ->
    when (result) {
        is PointLogResult.Success -> {
            val items = result.items
            adapter.submitList(items)
        }
        is PointLogResult.Error -> {
            showError(result.error.message)
        }
    }
}
```

#### Pagination

```kotlin
var lastRowKey: String? = null
var hasMore = true
val allItems = mutableListOf<PointLogDisplayItem>()

while (hasMore) {
    val result = pointLogService.getPointLog(
        month = "2025-01",
        type = "earn",
        lastRowKey = lastRowKey
    )
    
    when (result) {
        is PointLogResult.Success -> {
            if (result.items.isEmpty()) {
                hasMore = false
            } else {
                allItems.addAll(result.items)
                lastRowKey = result.items.lastOrNull()?.rowKey
            }
        }
        is PointLogResult.Error -> {
            hasMore = false
            // Handle error
        }
    }
}
```

---

## PointLogDisplayItem (Ready-to-Use)

Pre-processed display item with extracted message. **Use this for UI display.**

| Field Name     | Description                              | Data Type     |
|----------------|------------------------------------------|---------------|
| displayMessage | Pre-extracted message ready to display   | String        |
| imageUrl       | Image URL if available from JSON         | String?       |
| points         | Point amount (may be from trace data)    | Int           |
| formattedDate  | Formatted date string (if provided)      | String?       |
| messageSource  | Indicates where message was extracted    | MessageSource |
| rawData        | Original PointLog for additional access  | PointLog      |

### Convenience Accessors

```kotlin
item.rowKey        // → rawData.rowKey
item.type          // → rawData.type
item.timestamp     // → rawData.timestamp
item.campaignId    // → rawData.campaignId
item.campaignName  // → rawData.campaignName
```

---

## MessageSource Enum

Indicates where the `displayMessage` was extracted from:

| Value         | Description                                    |
|---------------|------------------------------------------------|
| ORIGINAL      | Used original `message` field directly         |
| DETAIL        | Used `detail` field (for redeem/burn types)    |
| TRACE_POINT   | Extracted from AppTracePointModel JSON array   |
| TRACE         | Extracted from AppTraceModel JSON array        |
| JSON_OBJECT   | Parsed from JSON object in message             |
| JSON_ARRAY    | Parsed from JSON array in message              |
| CAMPAIGN_NAME | Used `campaignName` as fallback                |
| DEFAULT       | Used default message from config               |

---

## PointLogExtractorConfig

Configuration for customizing message extraction behavior and display texts.


| Field                    | Description                           | Default                          |
|--------------------------|---------------------------------------|----------------------------------|
| defaultMessageEarn       | Default message when points >= 0      | "Received points"                |
| defaultMessageBurn       | Default message when points < 0       | "Refund points"                  |
| defaultMessageActivity   | Default message when points is null   | "Received points from activity"  |
| welcomePointKeyword      | Keyword to detect welcome points      | "NewRegister"                    |
| welcomePointMessage      | Message for welcome points            | "Welcome Point"                  |
| useCampaignNameFallback  | Use campaignName as fallback          | true                             |

### Preset Configurations

```kotlin
// English (Default)
PointLogExtractorConfig.DEFAULT

// Thai
PointLogExtractorConfig.THAI
// Equivalent to:
PointLogExtractorConfig(
    defaultMessageEarn = "ได้รับแต้ม",
    defaultMessageBurn = "คืนแต้ม",
    defaultMessageActivity = "ได้รับแต้มจากกิจกรรม",
    welcomePointMessage = "แต้มต้อนรับ"
)
```

### Custom Configuration Example

```kotlin
val customConfig = PointLogExtractorConfig(
    defaultMessageEarn = "คุณได้รับแต้มสะสม",
    defaultMessageBurn = "หักแต้มแลกของรางวัล",
    defaultMessageActivity = "ได้รับแต้มจากกิจกรรม",
    welcomePointMessage = "ยินดีต้อนรับสมาชิกใหม่",
    useCampaignNameFallback = false  // Don't use campaign name
)

// Set once
pointLogService.setDisplayTexts(customConfig)

// Use everywhere
val result = pointLogService.getPointLog("2025-01", "earn")
```

---

## PointLog Entity (Raw Data)

Original API response data.

| Field Name   | Description                         | Data Type | JSON Field   |
|--------------|-------------------------------------|-----------|--------------|
| rowKey       | Database row key identifier         | String?   | RowKey       |
| userId       | User identifier                     | String?   | UserId       |
| info         | Additional information              | String?   | Info         |
| detail       | Transaction detail description      | String?   | Detail       |
| message      | Transaction message                 | String?   | Message      |
| points       | Point amount (positive or negative) | Int?      | Points       |
| type         | Transaction type                    | String?   | Type         |
| timestamp    | Transaction timestamp (seconds)     | Long?     | Timestamp    |
| campaignName | Related campaign name               | String?   | CampaignName |
| campaignId   | Related campaign identifier         | String?   | CampaignId   |
| input        | Input data for transaction          | String?   | Input        |

---

## Complete Usage Example

### ViewModel

```kotlin
class PointLogViewModel : ViewModel() {
    private val pointLogService = BuzzebeesSDK.instance().pointLog
    
    private val _pointLogs = MutableStateFlow<List<PointLogDisplayItem>>(emptyList())
    val pointLogs: StateFlow<List<PointLogDisplayItem>> = _pointLogs.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    init {
        // Set display texts once
        pointLogService.setDisplayTexts(PointLogExtractorConfig.THAI)
    }
    
    fun loadPointLogs(month: String, type: String) {
        viewModelScope.launch {
            when (val result = pointLogService.getPointLog(month, type)) {
                is PointLogResult.Success -> {
                    _pointLogs.value = result.items
                    _error.value = null
                }
                is PointLogResult.Error -> {
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
fun PointLogScreen(viewModel: PointLogViewModel = viewModel()) {
    val pointLogs by viewModel.pointLogs.collectAsState()
    val error by viewModel.error.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.loadPointLogs("2025-01", "earn")
    }
    
    LazyColumn {
        items(pointLogs) { item ->
            PointLogItem(item)
        }
    }
}

@Composable
fun PointLogItem(item: PointLogDisplayItem) {
    val isPositive = item.points >= 0
    val pointColor = if (isPositive) Color.Green else Color.Red
    
    Card(modifier = Modifier.padding(8.dp)) {
        Row(modifier = Modifier.padding(16.dp)) {
            Column(modifier = Modifier.weight(1f)) {
                // ✅ displayMessage is ready to use!
                Text(
                    text = item.displayMessage,
                    style = MaterialTheme.typography.titleMedium
                )
                
                // Show image if available
                item.imageUrl?.let { url ->
                    AsyncImage(
                        model = url,
                        contentDescription = null,
                        modifier = Modifier.size(80.dp)
                    )
                }
                
                // Type badge
                item.type?.let { type ->
                    AssistChip(
                        onClick = {},
                        label = { Text(type) }
                    )
                }
            }
            
            // Points
            Text(
                text = "${if (isPositive) "+" else ""}${item.points}",
                color = pointColor,
                style = MaterialTheme.typography.titleLarge
            )
        }
    }
}
```

---

## Message Extraction Flow

The SDK automatically extracts display messages using the following decision flow:

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MESSAGE EXTRACTION FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  STEP 1: Check Trace Point    │
                    │  Is message a JSON Array      │
                    │  with "userDescription"?      │
                    └───────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
               [YES]                            [NO]
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌───────────────────────────────┐
    │ ✅ Use userDescription    │   │  STEP 2: Check Trace          │
    │    from first item        │   │  Is detail a JSON Array       │
    │                           │   │  with "name"?                 │
    │ Also extract:             │   └───────────────────────────────┘
    │ • points (override)       │                   │
    │                           │   ┌───────────────┴───────────────┐
    │ Source: TRACE_POINT       │   ▼                               ▼
    └───────────────────────────┘  [YES]                          [NO]
                                    │                               │
                                    ▼                               ▼
                    ┌───────────────────────────┐   ┌───────────────────────────┐
                    │ ✅ Use name from          │   │  STEP 3: Check Type       │
                    │    first item             │   │                           │
                    │                           │   │  Is type one of:          │
                    │ Source: TRACE             │   │  redeem/burn/purchase?    │
                    └───────────────────────────┘   └───────────────────────────┘
                                                                │
                                                ┌───────────────┴───────────────┐
                                                ▼                               ▼
                                           [YES]                            [NO]
                                                │                               │
                                                ▼                               ▼
              ┌─────────────────────────────────────┐       ┌─────────────────────────────────────┐
              │    REDEEM/BURN/PURCHASE PATH        │       │    GENERAL PATH (earn/trace/etc)    │
              └─────────────────────────────────────┘       └─────────────────────────────────────┘
                                │                                           │
                                ▼                                           ▼
              ┌─────────────────────────────────────┐       ┌─────────────────────────────────────┐
              │ Is detail non-empty and NOT JSON?   │       │ Does message contain                │
              └─────────────────────────────────────┘       │ welcomePointKeyword?                │
                                │                           │ (default: "NewRegister")            │
              ┌─────────────────┴─────────────────┐         └─────────────────────────────────────┘
              ▼                                   ▼                         │
           [YES]                               [NO]         ┌───────────────┴───────────────┐
              │                                   │         ▼                               ▼
              ▼                                   │      [YES]                            [NO]
┌─────────────────────────────┐                   │         │                               │
│ ✅ Use detail               │                   │         ▼                               │
│                             │                   │  ┌─────────────────────┐                │
│ Source: DETAIL              │                   │  │ ✅ Use              │                │
└─────────────────────────────┘                   │  │ welcomePointMessage │                │
                                                  │  │                     │                │
                                                  │  │ Source: ORIGINAL    │                │
                                                  │  └─────────────────────┘                │
                                                  │                                         │
                                                  ▼                                         ▼
                              ┌─────────────────────────────────────────────────────────────────┐
                              │                    STEP 4: Try JSON Parsing                     │
                              │                    (Same for both paths)                        │
                              └─────────────────────────────────────────────────────────────────┘
                                                            │
                                                            ▼
                              ┌─────────────────────────────────────────────────────────────────┐
                              │ Is message non-empty?                                           │
                              └─────────────────────────────────────────────────────────────────┘
                                                            │
                                        ┌───────────────────┴───────────────────┐
                                        ▼                                       ▼
                                     [YES]                                    [NO]
                                        │                                       │
                                        ▼                                       │
                              ┌───────────────────────────────┐                 │
                              │ Try extractFromJsonMessage()  │                 │
                              │                               │                 │
                              │ Extract from JSON:            │                 │
                              │ • "message" or "Message"      │                 │
                              │ • "FullImageUrl"              │                 │
                              │                               │                 │
                              │ Supports:                     │                 │
                              │ • JSONObject                  │                 │
                              │ • JSONArray (use first item)  │                 │
                              └───────────────────────────────┘                 │
                                                │                               │
                                ┌───────────────┴───────────────┐               │
                                ▼                               ▼               │
                           [Found]                         [Not Found]          │
                                │                               │               │
                                ▼                               ▼               │
            ┌───────────────────────────────┐    ┌───────────────────────────┐  │
            │ ✅ Use extracted message      │    │ Is message NOT valid JSON?│  │
            │    + imageUrl if present      │    │ (plain text check)        │  │
            │                               │    └───────────────────────────┘  │
            │ Source: JSON_OBJECT           │                    │              │
            │     or JSON_ARRAY             │        ┌───────────┴───────────┐  │
            └───────────────────────────────┘        ▼                       ▼  │
                                                  [YES]                   [NO]  │
                                                     │                       │  │
                                                     ▼                       │  │
                                    ┌─────────────────────────┐              │  │
                                    │ ✅ Use message as-is   │              │  │
                                    │                        │              │  │
                                    │ Source: ORIGINAL       │              │  │
                                    └─────────────────────────┘              │  │
                                                                             │  │
                                                                             ▼  ▼
                              ┌─────────────────────────────────────────────────────────────────┐
                              │                    STEP 5: Fallback Chain                       │
                              └─────────────────────────────────────────────────────────────────┘
                                                            │
                                                            ▼
                              ┌─────────────────────────────────────────────────────────────────┐
                              │  Fallback order (check each until one succeeds):               │
                              │                                                                 │
                              │  1. REDEEM PATH ONLY: (already handled above)                  │
                              │                                                                 │
                              │  2. GENERAL PATH ONLY: detail (if non-empty & not JSON)        │
                              │     → Source: DETAIL                                           │
                              │                                                                 │
                              │  3. campaignName (if useCampaignNameFallback=true & non-empty) │
                              │     → Source: CAMPAIGN_NAME                                    │
                              │                                                                 │
                              │  4. Default message based on points:                           │
                              │     • points >= 0  → defaultMessageEarn                        │
                              │     • points < 0   → defaultMessageBurn                        │
                              │     • points null  → defaultMessageActivity                    │
                              │     → Source: DEFAULT                                          │
                              └─────────────────────────────────────────────────────────────────┘
```

### Priority Summary

| Priority | Condition | Source | Output |
|----------|-----------|--------|--------|
| 1 | `message` = `[{"userDescription": "..."}]` | TRACE_POINT | userDescription + points |
| 2 | `detail` = `[{"name": "..."}]` | TRACE | name |
| 3a | type=redeem/burn + `detail` non-empty | DETAIL | detail |
| 3b | `message` contains welcomeKeyword | ORIGINAL | welcomePointMessage |
| 4 | `message` = `{"message": "..."}` | JSON_OBJECT | message + imageUrl |
| 5 | `message` non-empty plain text | ORIGINAL | message |
| 6 | `detail` non-empty plain text | DETAIL | detail |
| 7 | `campaignName` non-empty (if enabled) | CAMPAIGN_NAME | campaignName |
| 8 | None of above | DEFAULT | defaultMessage |

---

## Summary

The PointLogUseCase provides point transaction history functionality within the Buzzebees SDK. 

**Key Features:**
- **`setDisplayTexts()` method** - Configure display texts once, use everywhere
- Retrieves user point earning and spending logs
- **Automatic message extraction** from various formats (JSON, trace data, plain text)
- **Ready-to-display `PointLogDisplayItem`** with pre-processed data
- Built-in presets for English (`DEFAULT`) and Thai (`THAI`)
- Pagination support via `lastRowKey`
- Access to raw data when needed

**Benefits:**
- No need to pass config on every API call
- No more manual JSON parsing in your app
- Consistent message display across different data formats
- Easy localization with config presets
- Reduced boilerplate code in ViewModels

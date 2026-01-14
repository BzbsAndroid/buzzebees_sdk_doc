# Buzzebees API Integration

Welcome to the Buzzebees SDK API Integration documentation. This guide provides comprehensive documentation for all available Use Cases and features in the SDK.

---

## Getting Started

### SDK Initialization

The SDK initializes automatically via ContentProvider. Simply access the SDK instance:

```kotlin
val sdk = BuzzebeesSDK.instance()
```

### Accessing Use Cases

Each use case is accessible through the SDK instance:

```kotlin
val authUseCase = BuzzebeesSDK.instance().auth
val campaignUseCase = BuzzebeesSDK.instance().campaign
val profileUseCase = BuzzebeesSDK.instance().profile
val historyUseCase = BuzzebeesSDK.instance().history
// ... and more
```

---

## Available Use Cases

### Authentication & User Management

| Use Case | Description | Guide |
|----------|-------------|-------|
| **Auth UseCase** | Login, logout, token management | [View Guide](./AuthUseCase_GUIDE.md) |
| **Auth Provider** | Token storage and locale management | [View Guide](./auth_provider_guide.md) |
| **Register UseCase** | User registration | [View Guide](./RegisterUseCase_GUIDE.md) |
| **Profile UseCase** | User profile management | [View Guide](./ProfileUseCase_GUIDE.md) |
| **OTP UseCase** | OTP verification | [View Guide](./OTPUseCase_GUIDE.md) |
| **Consent UseCase** | User consent management | [View Guide](./ConsentUseCase_GUIDE.md) |
| **UserLevel UseCase** | User level and tier management | [View Guide](./UserLevelUseCase_GUIDE.md) |

### Campaign & Rewards

| Use Case | Description | Guide |
|----------|-------------|-------|
| **Campaign UseCase** | Campaign listing and filtering | [View Guide](./CampaignUseCase_GUIDE.md) |
| **Campaign Detail** | Campaign details, variants, validation, redemption | [View Guide](./CampaignDetail_GUIDE.md) |
| **Coupon UseCase** | Coupon management | [View Guide](./CouponUseCase_GUIDE.md) |
| **Stamp UseCase** | Stamp collection campaigns | [View Guide](./StampUseCase_GUIDE.md) |
| **Badge UseCase** | Badge and achievement management | [View Guide](./BadgeUseCase_GUIDE.md) |

### Shopping & Cart

| Use Case | Description | Guide |
|----------|-------------|-------|
| **Cart UseCase** | Shopping cart management | [View Guide](./CartUseCase_GUIDE.md) |
| **Category UseCase** | Category listing | [View Guide](./CategoryUseCase_GUIDE.md) |

### History & Transactions

| Use Case | Description | Guide |
|----------|-------------|-------|
| **History UseCase** | Purchase and redemption history | [View Guide](./HistoryUseCase_GUIDE.md) |
| **PointLog UseCase** | Point transaction history | [View Guide](./PointLogUseCase_GUIDE.md) |
| **Wallet UseCase** | Wallet and balance management | [View Guide](./WalletUseCase_GUIDE.md) |

### Address & Location

| Use Case | Description | Guide |
|----------|-------------|-------|
| **Address UseCase** | Address management | [View Guide](./AddressUseCase_GUIDE.md) |
| **Address Information UseCase** | Address information lookup | [View Guide](./AddressInformationUseCase_GUIDE.md) |
| **Place UseCase** | Place and location services | [View Guide](./PlaceUseCase_GUIDE.md) |
| **ZipCode UseCase** | Postal code lookup | [View Guide](./ZipCodeUseCase_GUIDE.md) |

### Notifications & Communication

| Use Case | Description | Guide |
|----------|-------------|-------|
| **Notification UseCase** | Push notification management | [View Guide](./NotificationUseCase_GUIDE.md) |
| **RequestHelp UseCase** | Customer support requests | [View Guide](./RequestHelpUseCase_GUIDE.md) |

### System & Utilities

| Use Case | Description | Guide |
|----------|-------------|-------|
| **Dashboard UseCase** | Dashboard data and widgets | [View Guide](./DashBoardUseCase_GUIDE.md) |
| **Maintenance UseCase** | System maintenance status | [View Guide](./MaintenanceUseCase_GUIDE.md) |

---

## Advanced Features

| Feature | Description | Guide |
|---------|-------------|-------|
| **Custom API Integration** | Build custom APIs using SDK infrastructure | [View Guide](./CustomApiIntegration_GUIDE.md) |
| **URL Builder Extensions** | URL generation utilities | [View Guide](./UrlExtensions_GUIDE.md) |
| **Image Loading** | Image loading best practices | [View Guide](./IMAGE_LOADING_GUIDE.md) |

---

## Error Handling

| Topic | Description | Guide |
|-------|-------------|-------|
| **Error Handler Implementation** | Centralized error handling | [View Guide](./ErrorHandlerGuide.md) |
| **Error Handling Summary** | Error codes and patterns | [View Guide](./ERROR_HANDLING_UPDATE_SUMMARY.md) |

---

## Comprehensive Guide

For a complete overview of SDK architecture and all features:

📖 [**SDK Comprehensive Guide**](./SDK_COMPREHENSIVE_GUIDE.md)

---

## Display Texts Configuration

Many Use Cases support localization via `setDisplayTexts()`. Set display texts once at app startup:

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Set Thai display texts for all services
        BuzzebeesSDK.instance().apply {
            history.setDisplayTexts(HistoryExtractorConfig.THAI)
            pointLog.setDisplayTexts(PointLogExtractorConfig.THAI)
            campaignDetailUseCase.setDisplayTexts(CampaignDetailExtractorConfig.THAI)
        }
    }
}
```

### Available Presets

| Service | English | Thai |
|---------|---------|------|
| History | `HistoryExtractorConfig.DEFAULT` | `HistoryExtractorConfig.THAI` |
| PointLog | `PointLogExtractorConfig.DEFAULT` | `PointLogExtractorConfig.THAI` |
| CampaignDetail | `CampaignDetailExtractorConfig.DEFAULT` | `CampaignDetailExtractorConfig.THAI` |

---

## Quick Links

- 🏠 [Home](/)
- 🖼️ [Image Loading Guide](./IMAGE_LOADING_GUIDE.md)
- 📚 [SDK Comprehensive Guide](./SDK_COMPREHENSIVE_GUIDE.md)

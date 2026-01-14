export default {
  title: "Buzzebees SDK Docs",
  description: "Documentation for Buzzebees SDK",
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API Integration', link: '/readme/' },
      { text: 'Image Loading', link: '/readme/IMAGE_LOADING_GUIDE' }
    ],
    
    sidebar: {
      '/readme/': [
        {
          text: 'API Integration',
          collapsed: false,
          items: [
            { text: 'Address UseCase', link: '/readme/AddressUseCase_GUIDE' },
            { text: 'Address Information UseCase', link: '/readme/AddressInformationUseCase_GUIDE' },
            { text: 'Auth UseCase', link: '/readme/AuthUseCase_GUIDE' },
            { text: 'Auth Provider', link: '/readme/auth_provider_guide' },
            { text: 'Badge UseCase', link: '/readme/BadgeUseCase_GUIDE' },
            { text: 'Campaign UseCase', link: '/readme/CampaignUseCase_GUIDE' },
            { text: 'Campaign Detail', link: '/readme/CampaignDetail_GUIDE' },
            { text: 'Cart UseCase', link: '/readme/CartUseCase_GUIDE' },
            { text: 'Category UseCase', link: '/readme/CategoryUseCase_GUIDE' },
            { text: 'Consent UseCase', link: '/readme/ConsentUseCase_GUIDE' },
            { text: 'Coupon UseCase', link: '/readme/CouponUseCase_GUIDE' },
            { text: 'Dashboard UseCase', link: '/readme/DashBoardUseCase_GUIDE' },
            { text: 'History UseCase', link: '/readme/HistoryUseCase_GUIDE' },
            { text: 'Maintenance UseCase', link: '/readme/MaintenanceUseCase_GUIDE' },
            { text: 'Notification UseCase', link: '/readme/NotificationUseCase_GUIDE' },
            { text: 'OTP UseCase', link: '/readme/OTPUseCase_GUIDE' },
            { text: 'Place UseCase', link: '/readme/PlaceUseCase_GUIDE' },
            { text: 'PointLog UseCase', link: '/readme/PointLogUseCase_GUIDE' },
            { text: 'Profile UseCase', link: '/readme/ProfileUseCase_GUIDE' },
            { text: 'Register UseCase', link: '/readme/RegisterUseCase_GUIDE' },
            { text: 'RequestHelp UseCase', link: '/readme/RequestHelpUseCase_GUIDE' },
            { text: 'Stamp UseCase', link: '/readme/StampUseCase_GUIDE' },
            { text: 'UserLevel UseCase', link: '/readme/UserLevelUseCase_GUIDE' },
            { text: 'Wallet UseCase', link: '/readme/WalletUseCase_GUIDE' },
            { text: 'ZipCode UseCase', link: '/readme/ZipCodeUseCase_GUIDE' }
          ]
        },
        {
          text: 'Advanced Features',
          collapsed: false,
          items: [
            { text: 'Custom API Integration', link: '/readme/CustomApiIntegration_GUIDE' },
            { text: 'URL Builder Extensions', link: '/readme/UrlExtensions_GUIDE' },
            { text: 'Image Loading Guide', link: '/readme/IMAGE_LOADING_GUIDE' }
          ]
        },
        {
          text: 'Error Handling',
          collapsed: false,
          items: [
            { text: 'Error Handler Implementation', link: '/readme/ErrorHandlerGuide' },
            { text: 'Error Handling Summary', link: '/readme/ERROR_HANDLING_UPDATE_SUMMARY' }
          ]
        },
        {
          text: 'Comprehensive Guide',
          items: [
            { text: 'SDK Comprehensive Guide', link: '/readme/SDK_COMPREHENSIVE_GUIDE' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/buzzebees' }
    ]
  }
}

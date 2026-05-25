import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20
  },
  appRoot: {
    backgroundColor: "#F7F2E8",
    flex: 1
  },
  authPanel: {
    gap: 14,
    paddingTop: 48
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#2F6F73",
    borderRadius: 48,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800"
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E5F0EF",
    borderColor: "#BBD3D1",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  badgeText: {
    color: "#24575A",
    fontSize: 13,
    fontWeight: "900"
  },
  bodyText: {
    color: "#534D45",
    fontSize: 15,
    lineHeight: 21
  },
  cardTitle: {
    color: "#26231F",
    fontSize: 18,
    fontWeight: "800"
  },
  content: {
    gap: 14,
    padding: 18,
    paddingBottom: 112
  },
  discoverCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1D8C8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    minHeight: 430,
    padding: 20
  },
  disabledButton: {
    opacity: 0.5
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1D8C8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 18
  },
  errorText: {
    color: "#B42318",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20
  },
  field: {
    gap: 6
  },
  flexOne: {
    flex: 1
  },
  choiceChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D7CDBB",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  choiceChipSelected: {
    backgroundColor: "#2F6F73",
    borderColor: "#2F6F73"
  },
  choiceText: {
    color: "#332F29",
    fontSize: 13,
    fontWeight: "800"
  },
  choiceTextSelected: {
    color: "#FFFFFF"
  },
  chatActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end"
  },
  chatAvatar: {
    alignItems: "center",
    backgroundColor: "#E5F0EF",
    borderColor: "#BBD3D1",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  chatAvatarText: {
    color: "#24575A",
    fontSize: 15,
    fontWeight: "900"
  },
  chatIdentityRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  chatActionButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D7CDBB",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  chatActionText: {
    color: "#332F29",
    fontSize: 12,
    fontWeight: "900"
  },
  chatScreenRoot: {
    backgroundColor: "#F7F2E8",
    flex: 1,
    gap: 12,
    padding: 18
  },
  chatThread: {
    flexGrow: 1,
    gap: 10,
    justifyContent: "flex-end",
    paddingVertical: 8
  },
  chatThreadScroll: {
    flex: 1
  },
  dangerIconButton: {
    alignItems: "center",
    backgroundColor: "#FFF1F0",
    borderColor: "#D64545",
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  dangerIconText: {
    color: "#B42318",
    fontSize: 16,
    fontWeight: "900"
  },
  dangerActionButton: {
    alignItems: "center",
    backgroundColor: "#FFF1F0",
    borderColor: "#D64545",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  dangerActionText: {
    color: "#B42318",
    fontSize: 12,
    fontWeight: "900"
  },
  groupFuzzy: {
    alignItems: "center",
    backgroundColor: "rgba(47, 111, 115, 0.18)",
    borderColor: "rgba(47, 111, 115, 0.38)",
    borderRadius: 56,
    borderWidth: 2,
    height: 112,
    justifyContent: "center",
    position: "absolute",
    width: 112
  },
  groupFuzzyA: {
    left: "8%",
    top: "12%"
  },
  groupFuzzyB: {
    bottom: "10%",
    right: "10%"
  },
  groupFuzzyText: {
    color: "#24575A",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center"
  },
  header: {
    gap: 8,
    paddingTop: 16
  },
  heroTitle: {
    color: "#26231F",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 36
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D7CDBB",
    borderRadius: 8,
    borderWidth: 1,
    color: "#26231F",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14
  },
  kicker: {
    color: "#2F6F73",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  label: {
    color: "#332F29",
    fontSize: 13,
    fontWeight: "800"
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1D8C8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14
  },
  locationPill: {
    backgroundColor: "#E5F0EF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  locationText: {
    color: "#24575A",
    fontSize: 13,
    fontWeight: "900"
  },
  loadingScreen: {
    alignItems: "center",
    backgroundColor: "#F7F2E8",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  mapCanvas: {
    backgroundColor: "#DDE7DA",
    borderColor: "#B3C7B9",
    borderRadius: 8,
    borderWidth: 1,
    height: 240,
    overflow: "hidden"
  },
  mapCenter: {
    alignItems: "center",
    backgroundColor: "#2F6F73",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    left: "43%",
    position: "absolute",
    top: "42%",
    width: 52
  },
  mapCenterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  mapActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  mapDot: {
    alignItems: "center",
    backgroundColor: "#D95F43",
    borderColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 3,
    minHeight: 30,
    justifyContent: "center",
    maxWidth: 96,
    minWidth: 50,
    paddingHorizontal: 8,
    position: "absolute",
  },
  mapDotA: {
    left: "22%",
    top: "24%"
  },
  mapDotB: {
    right: "18%",
    top: "34%"
  },
  mapDotC: {
    bottom: "20%",
    left: "30%"
  },
  mapDotText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900"
  },
  matchRate: {
    color: "#D95F43",
    fontSize: 54,
    fontWeight: "900",
    letterSpacing: 0
  },
  messageBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1D8C8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    maxWidth: "86%",
    padding: 12
  },
  messageBubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: "#2F6F73",
    borderColor: "#2F6F73"
  },
  messageComposer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  messageInput: {
    flex: 1
  },
  messageSender: {
    color: "#7C756A",
    fontSize: 12,
    fontWeight: "800"
  },
  messageSenderMine: {
    color: "#DDEDEA"
  },
  messageText: {
    color: "#332F29",
    fontSize: 15,
    lineHeight: 20
  },
  messageTextMine: {
    color: "#FFFFFF"
  },
  mediaGrid: {
    flexDirection: "row",
    gap: 10
  },
  mediaText: {
    color: "#534D45",
    fontWeight: "800"
  },
  mediaTile: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "#E9E0D0",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center"
  },
  metaText: {
    color: "#7C756A",
    fontSize: 13,
    lineHeight: 18
  },
  notice: {
    backgroundColor: "#E5F0EF",
    borderColor: "#BBD3D1",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12
  },
  noticeText: {
    color: "#24575A",
    fontSize: 14,
    fontWeight: "700"
  },
  noticeInlineText: {
    color: "#24575A",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
  },
  panel: {
    backgroundColor: "#FFF9ED",
    borderColor: "#E1D8C8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#2F6F73",
    borderRadius: 8,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  profileHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  recoveryInput: {
    flex: 1
  },
  recoveryPanel: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D7CDBB",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  secondaryButtonText: {
    color: "#2F6F73",
    fontSize: 15,
    fontWeight: "900"
  },
  sectionTitle: {
    color: "#332F29",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8
  },
  smallButton: {
    alignItems: "center",
    backgroundColor: "#F7F2E8",
    borderColor: "#D7CDBB",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  smallButtonText: {
    color: "#332F29",
    fontSize: 12,
    fontWeight: "900"
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E1D8C8",
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    gap: 5,
    left: 0,
    padding: 10,
    position: "absolute",
    right: 0
  },
  tabItem: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 4
  },
  tabItemActive: {
    backgroundColor: "#E5F0EF"
  },
  tabText: {
    color: "#7C756A",
    fontSize: 11,
    fontWeight: "800"
  },
  tabTextActive: {
    color: "#24575A"
  },
  tagChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D7CDBB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  tagChipSelected: {
    backgroundColor: "#2F6F73",
    borderColor: "#2F6F73"
  },
  tagResult: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1D8C8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 12
  },
  tagText: {
    color: "#332F29",
    fontSize: 13,
    fontWeight: "800"
  },
  tagTextSelected: {
    color: "#FFFFFF"
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  textArea: {
    minHeight: 86,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  topBar: {
    alignItems: "center",
    backgroundColor: "#F7F2E8",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10
  },
  topTitle: {
    color: "#26231F",
    fontSize: 24,
    fontWeight: "900"
  },
  warningText: {
    color: "#9E4A35",
    fontSize: 13,
    fontWeight: "800"
  }
});

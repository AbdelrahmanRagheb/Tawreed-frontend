import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Store,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Ban,
  X,
  Briefcase,
  MapPin,
  Package,
  ShoppingCart,
  TrendingUp,
  Activity,
  FileText,
  Mail,
  Phone,
  Calendar,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle,
  User,
} from "lucide-react";
import { useLanguage, getUnitDisplay, toArabicNumeral } from "../../i18n";
import {
  adminService,
  type AdminSupplier,
  type AdminSupplierDetail,
} from "../../services/admin.service";

export function AdminSuppliers() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all",
  );
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSupplier, setSelectedSupplier] =
    useState<AdminSupplierDetail | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    name: string;
    action: "approve" | "reject" | "suspend" | "reactivate";
  } | null>(null);
  const [confirmReason, setConfirmReason] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 100 };
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await adminService.listSuppliers(params);
      setSuppliers(res.data.items);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load suppliers",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
    setSearchParams(statusFilter === "all" ? {} : { status: statusFilter }, {
      replace: true,
    });
  }, [statusFilter]);

  useEffect(() => {
    const detailId = searchParams.get("detail");
    if (detailId && suppliers.length > 0) {
      const supplier = suppliers.find((s) => s.id === detailId);
      if (supplier) openDetail(supplier);
    }
  }, [searchParams, suppliers]);

  const filtered = suppliers.filter((s) => {
    const q = search.toLowerCase();
    return (
      !search ||
      s.companyName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.contactName.toLowerCase().includes(q)
    );
  });

  const regions = useMemo(() => {
    const r = new Set(suppliers.filter((s) => s.region).map((s) => s.region));
    return ["all", ...Array.from(r)];
  }, [suppliers]);

  const executeAction = async (
    id: string,
    action: "approve" | "reject" | "suspend" | "reactivate",
  ) => {
    setConfirmLoading(true);
    try {
      if (action === "approve") await adminService.approveSupplier(id);
      else if (action === "reject")
        await adminService.rejectSupplier(
          id,
          confirmReason || "Rejected by admin",
        );
      else if (action === "suspend")
        await adminService.suspendSupplier(
          id,
          confirmReason || "Suspended by admin",
        );
      else await adminService.reactivateSupplier(id);
      setConfirmTarget(null);
      setConfirmReason("");
      await loadSuppliers();
      if (selectedSupplier?.id === id) {
        const detail = await adminService.getSupplierDetail(id);
        setSelectedSupplier(detail.data);
      }
    } catch (err: any) {
      console.error("Failed to update supplier", err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const openDetail = async (supplier: AdminSupplier) => {
    try {
      const res = await adminService.getSupplierDetail(supplier.id);
      setSelectedSupplier(res.data);
    } catch {
      setSelectedSupplier(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (val: number) => {
    return toArabicNumeral(
      val.toLocaleString(language === "ar" ? "ar-SA" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      language,
    );
  };

  const displayStatus = (status: string) => {
    const map: Record<string, string> = {
      PendingApproval: "Pending",
      Active: "Approved",
      Suspended: "Suspended",
      Rejected: "Rejected",
    };
    return map[status] || status;
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-emerald-100 text-emerald-700",
      PendingApproval: "bg-amber-100 text-amber-700",
      Suspended: "bg-red-100 text-red-700",
      Rejected: "bg-slate-100 text-slate-600",
    };
    const icons: Record<string, any> = {
      Active: CheckCircle,
      PendingApproval: Clock,
      Suspended: Ban,
      Rejected: XCircle,
    };
    const Icon = icons[status];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[status] || "bg-slate-100 text-slate-600"}`}
      >
        {Icon && <Icon className="w-3 h-3" />}
        {displayStatus(status)}
      </span>
    );
  };

  const totalCount = suppliers.length;
  const pendingCount = suppliers.filter(
    (s) => s.status === "PendingApproval",
  ).length;
  const approvedCount = suppliers.filter((s) => s.status === "Active").length;
  const suspendedCount = suppliers.filter(
    (s) => s.status === "Suspended",
  ).length;

  if (loading && suppliers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("suppliers")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {toArabicNumeral(String(totalCount), language)}{" "}
            {t("suppliersRegistered")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
            <Store className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {toArabicNumeral(String(totalCount), language)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {t("totalSuppliers")}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {toArabicNumeral(String(pendingCount), language)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {t("pendingApproval")}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {toArabicNumeral(String(approvedCount), language)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t("active")}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-2">
            <Ban className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {toArabicNumeral(String(suspendedCount), language)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t("suspended")}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchSupplier")}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t("allStatus")}</option>
          <option value="PendingApproval">{t("pending")}</option>
          <option value="Active">{t("approved")}</option>
          <option value="Suspended">{t("suspended")}</option>
          <option value="Rejected">{t("rejected")}</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t("supplier")}
                </th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t("region")}
                </th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t("products")}
                </th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => openDetail(supplier)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          supplier.status === "Active"
                            ? "bg-emerald-100"
                            : supplier.status === "PendingApproval"
                              ? "bg-amber-100"
                              : "bg-red-100"
                        }`}
                      >
                        <Store
                          className={`w-4 h-4 ${
                            supplier.status === "Active"
                              ? "text-emerald-600"
                              : supplier.status === "PendingApproval"
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {supplier.companyName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {supplier.contactName} • {supplier.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {supplier.region || "-"}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">
                    {toArabicNumeral(String(supplier.totalProducts), language)}
                  </td>
                  <td className="px-5 py-3.5">
                    {statusBadge(supplier.status)}
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(supplier);
                        }}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {supplier.status === "PendingApproval" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmTarget({
                                id: supplier.id,
                                name: supplier.companyName,
                                action: "approve",
                              });
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmTarget({
                                id: supplier.id,
                                name: supplier.companyName,
                                action: "reject",
                              });
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {(supplier.status === "Active" ||
                        supplier.status === "Suspended") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmTarget({
                              id: supplier.id,
                              name: supplier.companyName,
                              action:
                                supplier.status === "Active"
                                  ? "suspend"
                                  : "reactivate",
                            });
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${supplier.status === "Active" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                        >
                          {supplier.status === "Active" ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            {t("noSuppliersFound")}
          </div>
        )}
      </div>

      {selectedSupplier && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bottom-16 md:bottom-0"
          onClick={() => {
            setSelectedSupplier(null);
            setExpandedProduct(null);
          }}
        >
          {/* Backdrop Overlay */}
          <div className="fixed inset-0 bg-black/40 bottom-16 md:bottom-0" />

          <div className="relative flex min-h-full w-full items-center justify-center p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:p-4 sm:pb-4">
            {/* Modal Card */}
            <div
              className="relative z-[71] w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[calc(100dvh-6.5rem)] sm:max-h-[90dvh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Header */}
              <div className="bg-white border-b border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedSupplier.status === "Active"
                        ? "bg-emerald-100"
                        : selectedSupplier.status === "PendingApproval"
                          ? "bg-amber-100"
                          : "bg-red-100"
                    }`}
                  >
                    <Store
                      className={`w-5 h-5 ${
                        selectedSupplier.status === "Active"
                          ? "text-emerald-600"
                          : selectedSupplier.status === "PendingApproval"
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      {selectedSupplier.companyName}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      {selectedSupplier.contactName} •{" "}
                      {selectedSupplier.categoryNames?.join(", ")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedSupplier(null);
                    setExpandedProduct(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body Content */}
              <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
                <div className="bg-slate-50 rounded-xl p-4 sm:p-5">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {t("companyInformation")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {selectedSupplier.companyName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedSupplier.region || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedSupplier.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        {t("joined")} {formatDate(selectedSupplier.joinedDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedSupplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        {toArabicNumeral(
                          selectedSupplier.phone || "-",
                          language,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        {t("lastLogin")}{" "}
                        {formatDate(selectedSupplier.lastLoginAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {selectedSupplier.emailVerified ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span>{t("emailVerified")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {selectedSupplier.phoneVerified ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span>{t("phoneVerified")}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {t("supplierStatistics")}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        icon: Package,
                        label: t("products"),
                        value: selectedSupplier.totalProducts,
                        color: "text-indigo-600",
                        bg: "bg-indigo-100",
                      },
                      {
                        icon: ShoppingCart,
                        label: t("totalOrders"),
                        value: selectedSupplier.totalOrders,
                        color: "text-emerald-600",
                        bg: "bg-emerald-100",
                      },
                      {
                        icon: TrendingUp,
                        label: t("activeOrders"),
                        value: selectedSupplier.activeOrders,
                        color: "text-blue-600",
                        bg: "bg-blue-100",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white border border-slate-200 rounded-lg p-3"
                      >
                        <div
                          className={`w-6 h-6 rounded ${stat.bg} flex items-center justify-center mb-1`}
                        >
                          <stat.icon className={`w-3 h-3 ${stat.color}`} />
                        </div>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight">
                          {toArabicNumeral(String(stat.value), language)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 break-words leading-tight">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSupplier.products &&
                  selectedSupplier.products.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        {t("productOverview")}
                      </h3>
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                          <table className="w-full text-sm min-w-[500px] sm:min-w-0">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-start px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("product")}
                                </th>
                                <th className="text-start px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("category")}
                                </th>
                                <th className="text-end px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("stock")}
                                </th>
                                <th className="text-end px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("basePrice")}
                                </th>
                                <th className="text-end px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("pricingTiers")}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedSupplier.products.map((p, i) => (
                                <tr key={i}>
                                  <td className="px-4 py-2.5 text-xs text-slate-700 font-medium">
                                    {p.name}
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-slate-500">
                                    {p.categoryName}
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-slate-700 text-end font-medium whitespace-nowrap">
                                    {toArabicNumeral(String(p.stock), language)}{" "}
                                    {getUnitDisplay(p.unit, language)}
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-slate-700 text-end font-medium whitespace-nowrap">
                                    {formatCurrency(p.price)}
                                  </td>
                                  <td className="px-4 py-2.5 text-end whitespace-nowrap">
                                    <button
                                      onClick={() =>
                                        setExpandedProduct(
                                          expandedProduct === i ? null : i,
                                        )
                                      }
                                      disabled={
                                        !p.pricingTiers ||
                                        p.pricingTiers.length === 0
                                      }
                                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed"
                                    >
                                      {toArabicNumeral(
                                        String(p.pricingTiers?.length || 0),
                                        language,
                                      )}{" "}
                                      tiers
                                      {p.pricingTiers &&
                                        p.pricingTiers.length > 0 &&
                                        (expandedProduct === i ? (
                                          <ChevronUp className="w-3 h-3" />
                                        ) : (
                                          <ChevronDown className="w-3 h-3" />
                                        ))}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {expandedProduct !== null &&
                                selectedSupplier.products[expandedProduct]
                                  ?.pricingTiers?.length > 0 && (
                                  <tr>
                                    <td
                                      colSpan={5}
                                      className="px-4 py-3 bg-slate-50"
                                    >
                                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        {t("pricingTiers")}
                                      </div>
                                      <table className="w-full text-xs">
                                        <thead>
                                          <tr className="border-b border-slate-200">
                                            <th className="text-start py-1.5 text-[10px] font-semibold text-slate-500">
                                              {t("minQty")}
                                            </th>
                                            <th className="text-start py-1.5 text-[10px] font-semibold text-slate-500">
                                              {t("maxQty")}
                                            </th>
                                            <th className="text-end py-1.5 text-[10px] font-semibold text-slate-500">
                                              {t("unitPrice")}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {selectedSupplier.products[
                                            expandedProduct
                                          ].pricingTiers.map((tier, ti) => (
                                            <tr
                                              key={ti}
                                              className="border-b border-slate-100 last:border-0"
                                            >
                                              <td className="py-1.5 text-slate-700">
                                                {toArabicNumeral(
                                                  String(tier.minQty),
                                                  language,
                                                )}
                                              </td>
                                              <td className="py-1.5 text-slate-700">
                                                {tier.maxQty != null
                                                  ? toArabicNumeral(
                                                      String(tier.maxQty),
                                                      language,
                                                    )
                                                  : "∞"}
                                              </td>
                                              <td className="py-1.5 text-slate-700 text-end font-medium">
                                                {formatCurrency(tier.unitPrice)}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedSupplier.recentOrders &&
                  selectedSupplier.recentOrders.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        {t("orderHistory")}
                      </h3>
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                          <table className="w-full text-sm min-w-[500px] sm:min-w-0">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-start px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("orderName")}
                                </th>
                                <th className="text-start px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("buyer")}
                                </th>
                                <th className="text-start px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("status")}
                                </th>
                                <th className="text-end px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("value")}
                                </th>
                                <th className="text-end px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">
                                  {t("createdOn")}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedSupplier.recentOrders.map((order) => (
                                <tr key={order.id}>
                                  <td className="px-4 py-2.5 text-xs font-medium text-slate-700">
                                    {order.title}
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-slate-500">
                                    {order.buyerName}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    {statusBadge(order.status)}
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-slate-700 text-end font-medium whitespace-nowrap">
                                    {formatCurrency(order.totalAmount)}
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-slate-500 text-end whitespace-nowrap">
                                    {formatDate(order.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedSupplier.approvalLogs &&
                  selectedSupplier.approvalLogs.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        {t("activityTimeline")}
                      </h3>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 max-h-48 overflow-y-auto">
                        <div className="space-y-3">
                          {selectedSupplier.approvalLogs.map(
                            (log: any, i: number) => (
                              <div key={i} className="flex items-start gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                    log.action === "Approved"
                                      ? "bg-emerald-500"
                                      : log.action === "Rejected"
                                        ? "bg-red-500"
                                        : log.action === "Suspended"
                                          ? "bg-amber-500"
                                          : "bg-blue-500"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-slate-700">
                                    {log.action}
                                  </p>
                                  {log.reason && (
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                      {log.reason}
                                    </p>
                                  )}
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    {log.actorName} •{" "}
                                    {formatDate(log.createdAt)}
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                <div className="bg-slate-50 rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {t("accountStatus")}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    {statusBadge(selectedSupplier.status)}
                  </div>
                  {selectedSupplier.status === "Suspended" &&
                    selectedSupplier.suspensionReason && (
                      <div className="flex items-start gap-2 text-sm text-slate-600 bg-red-50 rounded-lg p-3 mb-3">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>
                          {t("suspensionReason")}:{" "}
                          {selectedSupplier.suspensionReason}
                        </span>
                      </div>
                    )}
                  <div className="flex gap-2 flex-wrap">
                    {selectedSupplier.status === "PendingApproval" && (
                      <>
                        <button
                          onClick={() =>
                            setConfirmTarget({
                              id: selectedSupplier.id,
                              name: selectedSupplier.companyName,
                              action: "approve",
                            })
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> {t("approve")}
                        </button>
                        <button
                          onClick={() =>
                            setConfirmTarget({
                              id: selectedSupplier.id,
                              name: selectedSupplier.companyName,
                              action: "reject",
                            })
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> {t("reject")}
                        </button>
                      </>
                    )}
                    {selectedSupplier.status === "Active" && (
                      <button
                        onClick={() =>
                          setConfirmTarget({
                            id: selectedSupplier.id,
                            name: selectedSupplier.companyName,
                            action: "suspend",
                          })
                        }
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" /> {t("suspendSupplier")}
                      </button>
                    )}
                    {(selectedSupplier.status === "Suspended" ||
                      selectedSupplier.status === "Rejected") && (
                      <button
                        onClick={() =>
                          setConfirmTarget({
                            id: selectedSupplier.id,
                            name: selectedSupplier.companyName,
                            action: "reactivate",
                          })
                        }
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />{" "}
                        {t("activateSupplier")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmTarget && (
        <div
          className="fixed inset-0 z-[80] overflow-y-auto"
          onClick={() => {
            setConfirmTarget(null);
            setConfirmReason("");
          }}
        >
          <div className="fixed inset-0 bg-black/40" />
          <div className="relative flex min-h-full w-full items-center justify-center p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:p-4 sm:pb-4">
            <div
              className="relative z-[81] w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    confirmTarget.action === "approve"
                      ? "bg-emerald-100"
                      : confirmTarget.action === "reject"
                        ? "bg-red-100"
                        : confirmTarget.action === "suspend"
                          ? "bg-amber-100"
                          : "bg-emerald-100"
                  }`}
                >
                  {confirmTarget.action === "approve" && (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  )}
                  {confirmTarget.action === "reject" && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  {confirmTarget.action === "suspend" && (
                    <Ban className="w-5 h-5 text-amber-600" />
                  )}
                  {confirmTarget.action === "reactivate" && (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {confirmTarget.action === "approve" &&
                      t("approveSupplierConfirm")}
                    {confirmTarget.action === "reject" &&
                      t("rejectSupplierConfirm")}
                    {confirmTarget.action === "suspend" &&
                      t("suspendBuyerConfirm")}
                    {confirmTarget.action === "reactivate" &&
                      t("reactivateBuyerConfirm")}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {confirmTarget.name}
                  </p>
                </div>
              </div>

              {(confirmTarget.action === "reject" ||
                confirmTarget.action === "suspend") && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    {confirmTarget.action === "reject"
                      ? t("rejectReason")
                      : t("reasonOptional")}
                  </label>
                  <textarea
                    value={confirmReason}
                    onChange={(e) => setConfirmReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder={
                      confirmTarget.action === "reject"
                        ? t("rejectReasonPlaceholder")
                        : t("reasonPlaceholder")
                    }
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setConfirmTarget(null);
                    setConfirmReason("");
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() =>
                    executeAction(confirmTarget.id, confirmTarget.action)
                  }
                  disabled={confirmLoading}
                  className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors ${
                    confirmTarget.action === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : confirmTarget.action === "reject"
                        ? "bg-red-600 hover:bg-red-700"
                        : confirmTarget.action === "suspend"
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                  } disabled:opacity-50`}
                >
                  {confirmLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {confirmTarget.action === "approve" && t("confirmApprove")}
                  {confirmTarget.action === "reject" && t("confirmReject")}
                  {confirmTarget.action === "suspend" && t("confirmSuspend")}
                  {confirmTarget.action === "reactivate" &&
                    t("confirmReactivate")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  MapPin,
  Search,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  X,
  Loader2,
  Building2,
  Home,
  Globe2,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  FolderTree,
  Layers,
  Maximize2,
  Minimize2,
  Shield,
} from "lucide-react";
import { useLanguage, toArabicNumeral } from "../../i18n";
import {
  adminService,
  type RegionTreeNode,
} from "../../services/admin.service";

interface RegionForm {
  nameAr: string;
  nameEn: string;
  parentId: string | null;
  type: string;
}

const emptyForm: RegionForm = {
  nameAr: "",
  nameEn: "",
  parentId: null,
  type: "Governorate",
};

const CENTER_TYPES = ["Qism", "Markaz", "Madina", "Hayy", "PoliceDepartment", "Region"];
const LOCALITY_TYPES = ["City", "Village", "Kafr", "Ezba", "Shiyakha", "Manshaat", "Zone", "CustomsZone", "QismSection"];

function isCenter(type: string) { return CENTER_TYPES.includes(type); }
function isLocality(type: string) { return LOCALITY_TYPES.includes(type); }
function hasChildren(type: string) { return type === "Governorate" || isCenter(type); }

const TYPE_COLORS: Record<string, string> = {
  Governorate: "bg-blue-100 text-blue-700 border-blue-200",
  Qism: "bg-green-100 text-green-700 border-green-200",
  Markaz: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Madina: "bg-teal-100 text-teal-700 border-teal-200",
  Hayy: "bg-cyan-100 text-cyan-700 border-cyan-200",
  PoliceDepartment: "bg-purple-100 text-purple-700 border-purple-200",
  Region: "bg-slate-100 text-slate-700 border-slate-200",
  City: "bg-green-100 text-green-700 border-green-200",
  Village: "bg-amber-100 text-amber-700 border-amber-200",
  Kafr: "bg-orange-100 text-orange-700 border-orange-200",
  Ezba: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Shiyakha: "bg-lime-100 text-lime-700 border-lime-200",
  Manshaat: "bg-stone-100 text-stone-700 border-stone-200",
  Zone: "bg-violet-100 text-violet-700 border-violet-200",
  CustomsZone: "bg-rose-100 text-rose-700 border-rose-200",
  QismSection: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const TYPE_LABELS: Record<string, [string, string]> = {
  Governorate: ["محافظة", "Governorate"],
  Qism: ["قسم", "Qism"],
  Markaz: ["مركز", "Markaz"],
  Madina: ["مدينة جديدة", "New City"],
  Hayy: ["حي", "District"],
  PoliceDepartment: ["إدارة شرطة", "Police Dept"],
  Region: ["منطقة", "Region"],
  City: ["مدينة", "City"],
  Village: ["قرية", "Village"],
  Kafr: ["كفر", "Kafr"],
  Ezba: ["عزبة", "Ezba"],
  Shiyakha: ["شياخة", "Shiyakha"],
  Manshaat: ["منشأة", "Manshaat"],
  Zone: ["نطاق", "Zone"],
  CustomsZone: ["دائرة جمركية", "Customs Zone"],
  QismSection: ["قسم أول/ثان", "Qism Section"],
};

function TypeBadge({ type, lang }: { type: string; lang: string }) {
  const labels = TYPE_LABELS[type] ?? [type, type];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md border ${TYPE_COLORS[type] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}
    >
      {type === "Governorate" && <Globe2 className="w-3 h-3" />}
      {(isCenter(type) || type === "City") && <Building2 className="w-3 h-3" />}
      {(type === "Village" || type === "Kafr" || type === "Ezba" || type === "Manshaat") && <Home className="w-3 h-3" />}
      {(type === "Shiyakha" || type === "QismSection") && <Layers className="w-3 h-3" />}
      {(type === "Zone") && <MapPin className="w-3 h-3" />}
      {(type === "CustomsZone" || type === "PoliceDepartment") && <Shield className="w-3 h-3" />}
      {lang === "ar" ? labels[0] : labels[1]}
    </span>
  );
}

function setNodeChildren(
  nodes: RegionTreeNode[],
  id: string,
  children: RegionTreeNode[],
): RegionTreeNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, children };
    if (n.children.length > 0)
      return { ...n, children: setNodeChildren(n.children, id, children) };
    return n;
  });
}

export function AdminRegions() {
  const { language, setLanguage, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [roots, setRoots] = useState<RegionTreeNode[]>([]);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState<
    Record<string, boolean>
  >({});
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [searchResults, setSearchResults] = useState<RegionTreeNode[] | null>(
    null,
  );
  const [searching, setSearching] = useState(false);

  // New states for reshaped user experience
  const [typeFilter, setTypeFilter] = useState<string>("all"); // 'all', 'Governorate', 'City', 'Village', 'active', 'inactive'

  const matchesType = useCallback((t: string) =>
    t === typeFilter ||
    (typeFilter === "City" && isCenter(t)) ||
    (typeFilter === "Village" && isLocality(t)),
  [typeFilter]);
  const [stats, setStats] = useState({ gov: 0, cities: 0, villages: 0 });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<RegionTreeNode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RegionTreeNode | null>(null);
  const [form, setForm] = useState<RegionForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchRoots = useCallback(() => {
    setLoading(true);
    adminService
      .getRegionRoots()
      .then((res) => {
        // We initialize with the mock root data. For robust tree view, we set loaded state for roots that have children in mock
        const rootNodes = res.data;
        setRoots(rootNodes);
        setLoaded({});
        setExpanded(new Set<string>());
        setError("");
      })
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load regions",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRoots();
  }, [fetchRoots]);

  const fetchStats = useCallback(() => {
    adminService
      .getRegionStats()
      .then((res) => {
        setStats({
          gov: res.data.governorates,
          cities: res.data.cities,
          villages: res.data.villages,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const loadChildren = useCallback(
    async (parentId: string) => {
      if (loaded[parentId] || loadingChildren[parentId]) return;
      setLoadingChildren((prev) => ({ ...prev, [parentId]: true }));
      try {
        const res = await adminService.getRegionChildren(parentId);
        const children = res.data;
        setRoots((prev) => setNodeChildren(prev, parentId, children));
        setLoaded((prev) => ({ ...prev, [parentId]: true }));
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [parentId]: false }));
      }
    },
    [loaded, loadingChildren],
  );

  const toggleExpand = (nodeId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
    if (!expanded.has(nodeId)) {
      loadChildren(nodeId);
    }
  };

  const expandAllNodes = () => {
    const allIds = new Set<string>();
    roots.forEach((r) => {
      allIds.add(r.id);
      loadChildren(r.id);
    });
    setExpanded(allIds);
  };

  const collapseAllNodes = () => {
    setExpanded(new Set<string>());
  };

  const toggleActive = async (id: string) => {
    try {
      await adminService.toggleRegion(id);
      // Optimistic update for snappy UI
      setRoots((prevRoots) => {
        const updateTree = (nodes: RegionTreeNode[]): RegionTreeNode[] => {
          return nodes.map((n) => {
            if (n.id === id) return { ...n, isActive: !n.isActive };
            if (n.children.length > 0)
              return { ...n, children: updateTree(n.children) };
            return n;
          });
        };
        return updateTree(prevRoots);
      });
      if (searchResults) {
        setSearchResults((prev) =>
          prev
            ? prev.map((n) =>
                n.id === id ? { ...n, isActive: !n.isActive } : n,
              )
            : null,
        );
      }
    } catch {
      /* ignore */
    }
  };

  const openAdd = (parentNode: RegionTreeNode | null = null) => {
    if (!parentNode) {
      setForm({ ...emptyForm, parentId: null, type: "Governorate" });
    } else {
      const childType = parentNode.type === "Governorate" ? "Qism" : "Village";
      setForm({ ...emptyForm, parentId: parentNode.id, type: childType });
    }
    setEditTarget(null);
    setShowAddModal(true);
  };

  const openEdit = (node: RegionTreeNode) => {
    setForm({
      nameAr: node.nameAr,
      nameEn: node.nameEn,
      parentId: node.parentId,
      type: node.type,
    });
    setEditTarget(node);
    setShowAddModal(true);
  };

  const handleTypeChange = (type: string) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const handleSave = async () => {
    if (!form.nameAr.trim() || !form.nameEn.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        await adminService.updateRegion(editTarget.id, {
          nameAr: form.nameAr,
          nameEn: form.nameEn,
          parentId: form.parentId,
          type: form.type,
        });
      } else {
        await adminService.createRegion({
          nameAr: form.nameAr,
          nameEn: form.nameEn,
          parentId: form.parentId ?? undefined,
          type: form.type,
        });
      }
      setShowAddModal(false);
      setEditTarget(null);
      setForm(emptyForm);
      fetchRoots();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await adminService.deleteRegion(deleteTarget.id);
      setDeleteTarget(null);
      fetchRoots();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = useCallback(async (q: string) => {
    setSearch(q);
    if (!q.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await adminService.listRegions({ search: q });
      setSearchResults(
        res.data.map((r) => ({
          ...r,
          children: [],
          parentName: null,
          updatedAt: null,
        })),
      );
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Filter root items if typeFilter is set
  const filteredRoots = useMemo(() => {
    if (typeFilter === "all") return roots;
    if (typeFilter === "active") return roots.filter((r) => r.isActive);
    if (typeFilter === "inactive") return roots.filter((r) => !r.isActive);
    // If filtering by specific type like City or Village, we still show the governorate if it contains that type
    return roots.filter((r) => {
      if (r.type === typeFilter) return true;
      const matchesType = (t: string) =>
        t === typeFilter ||
        (typeFilter === "City" && isCenter(t)) ||
        (typeFilter === "Village" && isLocality(t));
      const hasMatchingChild = r.children.some(
        (c) =>
          matchesType(c.type) ||
          c.children.some((v) => matchesType(v.type)),
      );
      return hasMatchingChild;
    });
  }, [roots, typeFilter]);

  const renderNode = (
    node: RegionTreeNode,
    depth: number,
    _parentNode: RegionTreeNode | null,
  ) => {
    const nodeChildren = loaded[node.id] ? node.children : [];
    const nodeHasChildren = hasChildren(node.type);
    const isExpanded = expanded.has(node.id);
    const isLoading = loadingChildren[node.id];
    const label = language === "ar" ? node.nameAr : node.nameEn;
    const altLabel = language === "en" ? node.nameAr : node.nameEn;

    // Filter check for children if a specific type filter is active
    const filteredChildren = nodeChildren.filter((child) => {
      if (typeFilter === "all") return true;
      if (typeFilter === "active") return child.isActive;
      if (typeFilter === "inactive") return !child.isActive;
      if (matchesType(child.type)) return true;
      if (child.children.some((v) => matchesType(v.type))) return true;
      return false;
    });

    return (
      <div key={node.id} className="relative group/item">
        {/* Indentation Line */}
        {depth > 0 && (
          <div
            className={`absolute top-0 bottom-0 w-0.5 bg-slate-200 group-hover/item:bg-indigo-300 transition-colors ${
              language === "ar" ? "right-6" : "left-6"
            }`}
            style={{
              [language === "ar" ? "right" : "left"]: `${depth * 28 + 12}px`,
            }}
          />
        )}

        <div
          className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50/80 transition-all duration-150 ${
            depth === 1
              ? "bg-slate-50/40 border-y border-slate-100/60"
              : "bg-white"
          }`}
          style={{
            [language === "ar" ? "paddingRight" : "paddingLeft"]:
              `${depth * 28 + 24}px`,
          }}
        >
          <button
            onClick={() => nodeHasChildren && toggleExpand(node.id)}
            className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
              nodeHasChildren
                ? "cursor-pointer text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                : "text-transparent cursor-default"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            ) : (
              nodeHasChildren &&
              (isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : language === "ar" ? (
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              ))
            )}
          </button>

          <div
            className={`p-2 rounded-lg ${
              node.type === "Governorate"
                ? "bg-blue-50 text-blue-600"
                : isCenter(node.type) || node.type === "City"
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
            }`}
          >
            {node.type === "Governorate" ? (
              <Globe2 className="w-4 h-4" />
            ) : isCenter(node.type) || node.type === "City" ? (
              <Building2 className="w-4 h-4" />
            ) : (
              <Home className="w-4 h-4" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{label}</span>
              <span className="text-xs font-normal text-slate-400 truncate">
                ({altLabel})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TypeBadge type={node.type} lang={language} />
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity bg-white/90 px-2 py-1 rounded-lg border border-slate-200/60 sm:border-none sm:bg-transparent shadow-sm sm:shadow-none">
            {nodeHasChildren && (
              <button
                onClick={() => openAdd(node)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                title={t("addSubregion")}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t("addSubregion")}</span>
              </button>
            )}
            <button
              onClick={() => openEdit(node)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title={t("edit")}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeleteTarget(node)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title={t("delete")}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => toggleActive(node.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                node.isActive
                  ? "text-emerald-600 hover:bg-emerald-50"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
              title={node.isActive ? t("deactivate") : t("activate")}
            >
              {node.isActive ? (
                <ToggleRight className="w-5 h-5 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Recursive Children */}
        {hasChildren && isExpanded && (
          <div className="divide-y divide-slate-100/60">
            {isLoading ? (
              <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                {language === "ar"
                  ? "جاري تحميل البيانات..."
                  : "Loading sub-regions..."}
              </div>
            ) : filteredChildren.length === 0 ? (
              <div
                className="py-3 text-xs text-slate-400 bg-slate-50/30 flex items-center gap-2 font-medium"
                style={{
                  [language === "ar" ? "paddingRight" : "paddingLeft"]:
                    `${(depth + 1) * 28 + 36}px`,
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-slate-300" />
                {t("noSubRegions")}
              </div>
            ) : (
              filteredChildren.map((child) =>
                renderNode(child, depth + 1, node),
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const renderGovernorateCard = (gov: RegionTreeNode) => {
    const isExpanded = expanded.has(gov.id);
    const isLoading = loadingChildren[gov.id];
    const govChildren = loaded[gov.id] ? gov.children : [];
    const label = language === "ar" ? gov.nameAr : gov.nameEn;
    const altLabel = language === "en" ? gov.nameAr : gov.nameEn;

    // Calculate nested breakdown for this specific governorate
    let directCities = 0;
    let totalVillages = 0;
    govChildren.forEach((c) => {
      if (isCenter(c.type)) directCities++;
      else if (isLocality(c.type)) totalVillages++;
      c.children.forEach((v) => {
        if (isLocality(v.type)) totalVillages++;
      });
    });

    const filteredCities = govChildren.filter((child) => {
      if (typeFilter === "all") return true;
      if (typeFilter === "active") return child.isActive;
      if (typeFilter === "inactive") return !child.isActive;
      if (matchesType(child.type)) return true;
      if (child.children.some((v) => matchesType(v.type))) return true;
      return false;
    });

    return (
      <div
        key={gov.id}
        className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
          language === "ar"
            ? "border-r-4 border-r-blue-600"
            : "border-l-4 border-l-blue-600"
        }`}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer hover:bg-slate-50/60 transition-colors select-none group/gov"
          onClick={() => toggleExpand(gov.id)}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <button className="w-7 h-7 flex items-center justify-center rounded-xl bg-slate-100 group-hover/gov:bg-indigo-50 text-slate-600 group-hover/gov:text-indigo-600 transition-colors shrink-0">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              ) : isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : language === "ar" ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {label}
                </h3>
                <span className="text-xs text-slate-400 font-medium truncate">
                  ({altLabel})
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <TypeBadge type={gov.type} lang={language} />

                {loaded[gov.id] && !isLoading && (
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    <span className="flex items-center gap-1 text-green-700 font-bold">
                      <Building2 className="w-3 h-3" />
                      {toArabicNumeral(String(directCities), language)} {language === "ar" ? "مركز / مدينة" : "Center"}
                      {directCities !== 1 && language === "en" ? "s" : ""}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1 text-amber-700 font-bold">
                      <Home className="w-3 h-3" />
                      {toArabicNumeral(String(totalVillages), language)} {language === "ar" ? "قرية / منطقة" : "Locality"}
                      {totalVillages !== 1 && language === "en" ? "ies" : "y"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar for Governorate */}
          <div
            className="flex items-center gap-1.5 pt-2 sm:pt-0 border-t border-slate-100 sm:border-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => openAdd(gov)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm hover:shadow"
              title={t("addSubregion")}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === "ar" ? "إضافة مركز" : "Add Center"}</span>
            </button>
            <button
              onClick={() => openEdit(gov)}
              className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-slate-200/80 hover:border-amber-200"
              title={t("edit")}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteTarget(gov)}
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200/80 hover:border-red-200"
              title={t("delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleActive(gov.id)}
              className={`p-2 rounded-xl transition-colors border ${
                gov.isActive
                  ? "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                  : "text-slate-400 hover:bg-slate-100 border-slate-200"
              }`}
              title={gov.isActive ? t("deactivate") : t("activate")}
            >
              {gov.isActive ? (
                <ToggleRight className="w-5 h-5 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        {isExpanded && (
          <div className="border-t border-slate-100 bg-slate-50/30 divide-y divide-slate-100">
            {isLoading ? (
              <div className="px-4 py-8 flex flex-col items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  {language === "ar"
                    ? "جاري تحميل المراكز والأحياء..."
                    : "Loading centers..."}
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50/80">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                {t("noCities")}
              </div>
            ) : (
              filteredCities.map((child) => renderNode(child, 1, gov))
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading && roots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">
          {language === "ar"
            ? "جاري تحميل نظام إدارة المناطق..."
            : "Loading Regional Administration System..."}
        </p>
      </div>
    );
  }

  if (error && roots.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-2xl border border-red-200 shadow-xl">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          {language === "ar" ? "خطأ في النظام" : "System Error"}
        </h2>
        <p className="text-sm text-red-600 mb-6">{error}</p>
        <button
          onClick={fetchRoots}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
        >
          {language === "ar" ? "إعادة المحاولة" : "Retry Loading"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Summary Metrics Cards - Using existing colors beautifully */}
        <section className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Governorates Metric Card (Blue theme) */}
            <div className="bg-white rounded-2xl border border-blue-200/80 p-5 shadow-sm hover:shadow transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Globe2 className="w-20 h-20 text-blue-600" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 inline-flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-blue-700" />
                  {t("governorates")}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {toArabicNumeral(String(stats.gov), language)}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" />{" "}
                  {language === "ar" ? "نشط بالكامل" : "100% active"}
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                {t("govNote")}
              </div>
            </div>

            {/* Cities Metric Card (Green theme) */}
            <div className="bg-white rounded-2xl border border-green-200/80 p-5 shadow-sm hover:shadow transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Building2 className="w-20 h-20 text-green-600" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green-800 bg-green-100 px-2.5 py-1 rounded-lg border border-green-200 inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-green-700" />
                  {t("cities")}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {toArabicNumeral(String(stats.cities), language)}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {language === "ar"
                    ? "متوسط 2-4 مدن لكل محافظة"
                    : "Avg 2-4 cities / gov"}
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                {language === "ar"
                  ? "تشمل المدن الرئيسية والمراكز الإدارية الكبرى."
                  : "Covers primary cities and major administrative districts."}
              </div>
            </div>

            {/* Villages Metric Card (Amber theme) */}
            <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm hover:shadow transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Home className="w-20 h-20 text-amber-600" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 inline-flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-700" />
                  {t("villages")}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {toArabicNumeral(String(stats.villages), language)}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {language === "ar"
                    ? "الوحدات المحلية والأحياء"
                    : "Sub-districts & communities"}
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                {language === "ar"
                  ? "أصغر التقسيمات الجغرافية التابعة للمدن."
                  : "Finest granularity geographic subdivisions under cities."}
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar & Interactive Controls */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${language === "ar" ? "right-3.5" : "left-3.5"}`}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className={`w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  language === "ar"
                    ? "pr-11 pl-9 text-right"
                    : "pl-11 pr-9 text-left"
                }`}
              />
              {search && (
                <button
                  onClick={() => handleSearch("")}
                  className={`absolute top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg ${
                    language === "ar" ? "left-2.5" : "right-2.5"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Type Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase mr-1 hidden lg:inline-block">
                {language === "ar" ? "تصنيف:" : "Filter:"}
              </span>
              {[
                { id: "all", label: t("all") },
                { id: "Governorate", label: t("governorates") },
                { id: "City", label: language === "ar" ? "مدن / مراكز" : "Cities / Centers" },
                { id: "Village", label: language === "ar" ? "قرى / مناطق" : "Villages / Areas" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    typeFilter === tab.id
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary helper row: Expand/Collapse All */}
          {!search.trim() && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="font-medium">
                {language === "ar"
                  ? "عرض هيكلى للمناطق والمحافظات"
                  : "Viewing Hierarchical Region Structure"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAllNodes}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  {t("expandAll")}
                </button>
                <button
                  onClick={collapseAllNodes}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  {t("collapseAll")}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Tree List / Search Results View */}
        {search.trim() ? (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
              {language === "ar"
                ? `نتائج البحث عن "${search}"`
                : `Search Results for "${search}"`}
            </h3>

            {searching ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500">
                  {language === "ar" ? "جاري البحث..." : "Searching..."}
                </span>
              </div>
            ) : searchResults && searchResults.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 mb-1">
                  {language === "ar"
                    ? "لا توجد نتائج مطابقة"
                    : "No matching regions found"}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {t("noResults")}
                </p>
                <button
                  onClick={() => handleSearch("")}
                  className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  {language === "ar" ? "مسح البحث" : "Clear Search"}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {(searchResults ?? []).map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl border shrink-0 ${
                          node.type === "Governorate"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : isCenter(node.type) || node.type === "City"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {node.type === "Governorate" && (
                          <Globe2 className="w-5 h-5" />
                        )}
                        {(isCenter(node.type) || node.type === "City") && (
                          <Building2 className="w-5 h-5" />
                        )}
                        {isLocality(node.type) && node.type !== "City" && (
                          <Home className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {language === "ar" ? node.nameAr : node.nameEn}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium truncate">
                            ({language === "en" ? node.nameAr : node.nameEn})
                          </span>
                        </div>
                        {node.parentName && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {language === "ar" ? "تابع لـ:" : "Parent:"}{" "}
                            <strong className="text-indigo-600 font-semibold">
                              {node.parentName}
                            </strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <TypeBadge type={node.type} lang={language} />
                      <button
                        onClick={() => toggleActive(node.id)}
                        className={`p-2 rounded-xl transition-colors border ${
                          node.isActive
                            ? "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                            : "text-slate-400 hover:bg-slate-100 border-slate-200"
                        }`}
                        title={node.isActive ? t("deactivate") : t("activate")}
                      >
                        {node.isActive ? (
                          <ToggleRight className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRoots.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <FolderTree className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <h4 className="text-base font-bold text-slate-800 mb-1">
                  {language === "ar"
                    ? "لا توجد محافظات تطابق عامل التصفية"
                    : "No governorates matching current filter"}
                </h4>
                <p className="text-xs text-slate-400 mb-4">{t("noRegions")}</p>
                {typeFilter !== "all" && (
                  <button
                    onClick={() => setTypeFilter("all")}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    {language === "ar" ? "عرض جميع الأنواع" : "Show All Types"}
                  </button>
                )}
              </div>
            ) : (
              filteredRoots.map((gov) => renderGovernorateCard(gov))
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg mx-auto overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {editTarget ? (
                    <Edit3 className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {editTarget ? t("editRegion") : t("addRegion")}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === "ar"
                      ? "يرجى ملء تفاصيل المنطقة بدقة"
                      : "Please complete the regional information below"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditTarget(null);
                }}
                className="w-8 h-8 rounded-xl bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t("nameAr")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nameAr}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nameAr: e.target.value }))
                  }
                  placeholder={
                    language === "ar"
                      ? "مثال: محافظة القاهرة أو مدينة نصر..."
                      : "e.g. Cairo Governorate or Nasr City..."
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t("nameEn")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nameEn: e.target.value }))
                  }
                  placeholder="e.g. Cairo Governorate, Nasr City..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "Governorate",
                      label: language === "ar" ? "محافظة" : "Governorate",
                      icon: Globe2,
                    },
                    {
                      id: "Qism",
                      label: language === "ar" ? "قسم" : "Qism",
                      icon: Building2,
                    },
                    {
                      id: "Markaz",
                      label: language === "ar" ? "مركز" : "Markaz",
                      icon: Building2,
                    },
                    {
                      id: "Hayy",
                      label: language === "ar" ? "حي" : "District",
                      icon: Building2,
                    },
                    {
                      id: "Madina",
                      label: language === "ar" ? "مدينة جديدة" : "New City",
                      icon: Building2,
                    },
                    {
                      id: "Region",
                      label: language === "ar" ? "منطقة" : "Region",
                      icon: MapPin,
                    },
                    {
                      id: "Village",
                      label: language === "ar" ? "قرية" : "Village",
                      icon: Home,
                    },
                    {
                      id: "Kafr",
                      label: language === "ar" ? "كفر" : "Kafr",
                      icon: Home,
                    },
                    {
                      id: "Ezba",
                      label: language === "ar" ? "عزبة" : "Ezba",
                      icon: Home,
                    },
                    {
                      id: "Shiyakha",
                      label: language === "ar" ? "شياخة" : "Shiyakha",
                      icon: Layers,
                    },
                    {
                      id: "City",
                      label: language === "ar" ? "مدينة" : "City",
                      icon: Building2,
                    },
                    {
                      id: "Manshaat",
                      label: language === "ar" ? "منشأة" : "Manshaat",
                      icon: Home,
                    },
                  ].map((tItem) => {
                    const Icon = tItem.icon;
                    const isSelected = form.type === tItem.id;
                    return (
                      <button
                        key={tItem.id}
                        type="button"
                        onClick={() => handleTypeChange(tItem.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1.5 ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-extrabold shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 font-semibold"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`}
                        />
                        <span className="text-xs">{tItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {form.type !== "Governorate" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {t("parentRegion")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.parentId ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        parentId: e.target.value || null,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  >
                    <option value="">
                      --{" "}
                      {language === "ar"
                        ? "اختر المنطقة الرئيسية..."
                        : "Select parent region..."}{" "}
                      --
                    </option>
                    {roots.map((n) =>
                      (form.type === "Governorate"
                        ? false
                        : isCenter(form.type)
                          ? n.type === "Governorate"
                          : n.type === "Governorate") &&
                      n.id !== editTarget?.id ? (
                        <option key={n.id} value={n.id}>
                          {language === "ar" ? n.nameAr : n.nameEn} ({n.type})
                        </option>
                      ) : null,
                    )}
                    {isLocality(form.type) &&
                      roots.flatMap((g) =>
                        (loaded[g.id] ? g.children : [])
                          .filter(
                            (c) => isCenter(c.type) && c.id !== editTarget?.id,
                          )
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {language === "ar"
                                ? `${c.nameAr} (${g.nameAr})`
                                : `${c.nameEn} (${g.nameEn})`}
                            </option>
                          )),
                      )}
                  </select>
                  {!form.parentId && (
                    <p className="text-xs text-amber-600 mt-1.5 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {language === "ar"
                        ? "مطلوب تحديد المنطقة الرئيسية لحفظ التغييرات."
                        : "Parent region is required for Cities and Villages."}
                    </p>
                  )}
                </div>
              )}

              {form.type === "Governorate" && (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <Globe2 className="w-6 h-6 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-900 font-medium">
                    {language === "ar"
                      ? "سيتم إضافة هذه المحافظة في المستوى الرئيسي الأول مباشرة ضمن القطر المصري."
                      : "This governorate will be created as a top-level root element directly under Egypt."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditTarget(null);
                }}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-200/70 rounded-xl hover:bg-slate-200 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  !form.nameAr.trim() ||
                  !form.nameEn.trim() ||
                  saving ||
                  (form.type !== "Governorate" && !form.parentId)
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editTarget ? t("save") : t("add")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md mx-auto overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Trash2 className="w-7 h-7" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                {t("deleteRegion")}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t("deleteRegionConfirm")}{" "}
                <strong className="text-slate-900 text-sm block my-1 font-extrabold">
                  {language === "ar"
                    ? deleteTarget.nameAr
                    : deleteTarget.nameEn}
                </strong>
                ?
              </p>
              {hasChildren(deleteTarget.type) && (
                <div className="p-3.5 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs font-bold flex items-center gap-2.5 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{t("deleteRegionCascade")}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-200/70 rounded-xl hover:bg-slate-200 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>
              {language === "ar"
                ? "نظام إدارة المناطق الجغرافية لمصر © 2026"
                : "Egypt Geographic Administration System © 2026"}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span>
              {language === "ar"
                ? "الإصدار 4.2 المطور"
                : "Enhanced Edition v4.2"}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {language === "ar"
                ? "الأنظمة تعمل بكفاءة"
                : "Systems Operational"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

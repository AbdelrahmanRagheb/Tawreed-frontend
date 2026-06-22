import { useState, useEffect, useRef } from 'react';
import { publicService, type PublicRegion } from '../services/public.service';
import { useLanguage } from '../i18n';
import { Loader2 } from 'lucide-react';

interface RegionCascaderProps {
  value: string;
  onChange: (regionId: string) => void;
}

export function RegionCascader({ value, onChange }: RegionCascaderProps) {
  const { language } = useLanguage();

  const [countryId, setCountryId] = useState('');
  const [governorateId, setGovernorateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [villageId, setVillageId] = useState('');

  const [governorates, setGovernorates] = useState<PublicRegion[]>([]);
  const [cities, setCities] = useState<PublicRegion[]>([]);
  const [villages, setVillages] = useState<PublicRegion[]>([]);

  const [ready, setReady] = useState(false);
  const initDone = useRef(false);

  useEffect(() => {
    publicService.getRootRegions().then((res) => {
      if (res.data.length > 0) setCountryId(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!countryId || initDone.current) return;

    const init = async () => {
      if (!value) {
        const govRes = await publicService.getRegionChildren(countryId);
        setGovernorates(govRes.data);
        initDone.current = true;
        setReady(true);
        return;
      }

      const chain: string[] = [];
      let cur: string = value;
      while (cur && cur !== countryId) {
        chain.unshift(cur);
        const reg = (await publicService.getRegion(cur)).data;
        cur = reg.parentId || '';
      }

      const govRes = await publicService.getRegionChildren(countryId);
      setGovernorates(govRes.data);

      if (chain[0]) {
        setGovernorateId(chain[0]);
        const cityRes = await publicService.getRegionChildren(chain[0]);
        setCities(cityRes.data);

        if (chain[1]) {
          setCityId(chain[1]);
          const vilRes = await publicService.getRegionChildren(chain[1]);
          setVillages(vilRes.data);

          if (chain[2]) {
            setVillageId(chain[2]);
          }
        }
      }

      initDone.current = true;
      setReady(true);
    };

    init();
  }, [countryId, value]);

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setGovernorateId(id);
    setCityId('');
    setVillageId('');
    setCities([]);
    setVillages([]);
    onChange(id);
    if (id) {
      publicService.getRegionChildren(id).then((res) => setCities(res.data));
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setCityId(id);
    setVillageId('');
    setVillages([]);
    if (id) {
      onChange(id);
      publicService.getRegionChildren(id).then((res) => setVillages(res.data));
    } else {
      onChange(governorateId);
    }
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setVillageId(id);
    if (id) {
      onChange(id);
    } else {
      onChange(cityId);
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {language === 'ar' ? 'جاري تحميل المناطق...' : 'Loading regions...'}
      </div>
    );
  }

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  return (
    <div className="space-y-3">
      <div>
        <select
          value={governorateId}
          onChange={handleGovChange}
          className="w-full h-11 px-4 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white transition-shadow"
        >
          <option value="">{t('-- اختر المحافظة --', '-- Select Governorate --')}</option>
          {governorates.map((r) => (
            <option key={r.id} value={r.id}>
              {t(r.nameAr, r.nameEn)}
            </option>
          ))}
        </select>
      </div>

      {governorateId && (
        <div>
          <select
            value={cityId}
            onChange={handleCityChange}
            className="w-full h-11 px-4 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white transition-shadow"
          >
            <option value="">{t('-- اختر المدينة --', '-- Select City --')}</option>
            {cities.map((r) => (
              <option key={r.id} value={r.id}>
                {t(r.nameAr, r.nameEn)}
              </option>
            ))}
          </select>
        </div>
      )}

      {cityId && (
        <div>
          <select
            value={villageId}
            onChange={handleVillageChange}
            className="w-full h-11 px-4 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white transition-shadow"
          >
            <option value="">{t('-- اختر القرية/المنطقة --', '-- Select Village/Area --')}</option>
            {villages.map((r) => (
              <option key={r.id} value={r.id}>
                {t(r.nameAr, r.nameEn)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

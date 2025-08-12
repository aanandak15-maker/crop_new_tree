import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Filter, Download, Upload, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CropTemplateSelector } from "./CropTemplateSelector";
import { CropTemplate } from "@/types/cropTemplates";
import { getTemplateById } from "@/data/cropTemplates";

interface Crop {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  season: string[];
  climate_type: string[];
  soil_type: string[];
  water_requirement: string;
  growth_duration: string;
  created_at: string;
  family?: string;
  temperature_range?: string;
  rainfall_requirement?: string;
  humidity_range?: string;
  soil_ph?: string;
  drainage_requirement?: string;
  land_preparation?: string[];
  seed_rate?: string;
  row_spacing?: string;
  sowing_time?: string;
  fertilizer_requirement?: string[];
  irrigation_schedule?: string[];
  harvesting_info?: string[];
  pest_list?: string[];
  disease_list?: string[];
  average_yield?: string;
  market_price?: string;
  cost_of_cultivation?: string;
  nutritional_info?: string;
  sustainability_practices?: string[];
  innovations?: string[];
  // New fields from the expanded form structure
  field_name?: string;
  origin?: string;
  climate_zone?: string;
  growth_habit?: string;
  life_span?: string;
  plant_type?: string;
  root_system?: string;
  leaf?: string;
  flowering_season?: string;
  inflorescence_type?: string;
  fruit_type?: string;
  fruit_development?: string;
  unique_morphology?: string;
  edible_part?: string;
  chromosome_number?: string;
  breeding_methods?: string;
  biotech_advances?: string;
  hybrid_varieties?: string;
  patents?: string;
  research_institutes?: string;
  pollination?: string;
  propagation_type?: string;
  planting_material?: string;
  germination_percent?: string;
  rootstock_compatibility?: string;
  nursery_practices?: string;
  training_system?: string;
  spacing?: string;
  planting_season?: string;
  npk_n?: string;
  npk_p?: string;
  npk_k?: string;
  micronutrient_needs?: string;
  biofertilizer_usage?: string;
  application_schedule_method?: string;
  application_schedule_stages?: string;
  application_schedule_frequency?: string;
  water_quality?: string;
  optimum_temp?: string;
  tolerable_temp?: string;
  altitude?: string;
  soil_texture?: string;
  light_requirement?: string;
  common_weeds?: string;
  weed_season?: string;
  weed_control_method?: string;
  critical_period_weed?: string;
  pest_name?: string;
  pest_symptoms?: string;
  pest_life_cycle?: string;
  pest_etl?: string;
  pest_management?: string;
  pest_biocontrol?: string;
  disease_name?: string;
  disease_causal_agent?: string;
  disease_symptoms?: string;
  disease_life_cycle?: string;
  disease_management?: string;
  disease_biocontrol?: string;
  disorder_name?: string;
  disorder_cause?: string;
  disorder_symptoms?: string;
  disorder_impact?: string;
  disorder_control?: string;
  nematode_name?: string;
  nematode_symptoms?: string;
  nematode_life_cycle?: string;
  nematode_etl?: string;
  nematode_management?: string;
  nematode_biocontrol?: string;
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string;
  minerals?: string;
  bioactive_compounds?: string;
  health_benefits?: string;
  variety_name?: string;
  yield?: string;
  variety_features?: string;
  variety_suitability?: string;
  market_demand?: string;
  harvest_time?: string;
  maturity_indicators?: string;
  harvesting_tools?: string;
  post_harvest_losses?: string;
  storage_conditions?: string;
  shelf_life?: string;
  processed_products?: string;
  packaging_types?: string;
  cold_chain?: string;
  ripening_characteristics?: string;
  pre_cooling?: string;
  market_trends?: string;
  export_potential?: string;
  export_destinations?: string;
  value_chain_players?: string;
  certifications?: string;
  subsidies?: string;
  schemes?: string;
  support_agencies?: string;
  ai_ml_iot?: string;
  smart_farming?: string;
  sustainability_potential?: string;
  waste_to_wealth?: string;
  climate_resilience?: string;
  carbon_footprint?: string;
  religious_use?: string;
  traditional_uses?: string;
  gi_status?: string;
  fun_fact?: string;
  key_takeaways?: string;
  swot_strengths?: string;
  swot_weaknesses?: string;
  swot_opportunities?: string;
  swot_threats?: string;
}

const EnhancedCropManagement = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CropTemplate | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [climateFilter, setClimateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    scientific_name: "",
    description: "",
    season: "",
    climate_type: "",
    soil_type: "",
    water_requirement: "",
    growth_duration: "",
    family: "",
    temperature_range: "",
    rainfall_requirement: "",
    humidity_range: "",
    soil_ph: "",
    drainage_requirement: "",
    land_preparation: "",
    seed_rate: "",
    row_spacing: "",
    sowing_time: "",
    fertilizer_requirement: "",
    irrigation_schedule: "",
    harvesting_info: "",
    pest_list: "",
    disease_list: "",
    average_yield: "",
    market_price: "",
    cost_of_cultivation: "",
    nutritional_info: "",
    sustainability_practices: "",
    innovations: "",
    // New fields for the expanded form structure
    root_system: "",
    leaf: "",
    chromosome_number: "",
    origin: "",
    field_name: "",
    climate_zone: "",
    growth_habit: "",
    life_span: "",
    plant_type: "",
    flowering_season: "",
    inflorescence_type: "",
    fruit_type: "",
    fruit_development: "",
    unique_morphology: "",
    edible_part: "",
    breeding_methods: "",
    biotech_advances: "",
    hybrid_varieties: "",
    patents: "",
    research_institutes: "",
    pollination: "",
    propagation_type: "",
    planting_material: "",
    germination_percent: "",
    rootstock_compatibility: "",
    nursery_practices: "",
    training_system: "",
    spacing: "",
    planting_season: "",
    npk_n: "",
    npk_p: "",
    npk_k: "",
    micronutrient_needs: "",
    biofertilizer_usage: "",
    application_schedule_method: "",
    application_schedule_stages: "",
    application_schedule_frequency: "",
    water_quality: "",
    optimum_temp: "",
    tolerable_temp: "",
    altitude: "",
    soil_texture: "",
    light_requirement: "",
    common_weeds: "",
    weed_season: "",
    weed_control_method: "",
    critical_period_weed: "",
    pest_name: "",
    pest_symptoms: "",
    pest_life_cycle: "",
    pest_etl: "",
    pest_management: "",
    pest_biocontrol: "",
    disease_name: "",
    disease_causal_agent: "",
    disease_symptoms: "",
    disease_life_cycle: "",
    disease_management: "",
    disease_biocontrol: "",
    disorder_name: "",
    disorder_cause: "",
    disorder_symptoms: "",
    disorder_impact: "",
    disorder_control: "",
    nematode_name: "",
    nematode_symptoms: "",
    nematode_life_cycle: "",
    nematode_etl: "",
    nematode_management: "",
    nematode_biocontrol: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    fiber: "",
    vitamins: "",
    minerals: "",
    bioactive_compounds: "",
    health_benefits: "",
    variety_name: "",
    yield: "",
    variety_features: "",
    variety_suitability: "",
    market_demand: "",
    harvest_time: "",
    maturity_indicators: "",
    harvesting_tools: "",
    post_harvest_losses: "",
    storage_conditions: "",
    shelf_life: "",
    processed_products: "",
    packaging_types: "",
    cold_chain: "",
    ripening_characteristics: "",
    pre_cooling: "",
    market_trends: "",
    export_potential: "",
    export_destinations: "",
    value_chain_players: "",
    certifications: "",
    subsidies: "",
    schemes: "",
    support_agencies: "",
    ai_ml_iot: "",
    smart_farming: "",
    sustainability_potential: "",
    waste_to_wealth: "",
    climate_resilience: "",
    carbon_footprint: "",
    religious_use: "",
    traditional_uses: "",
    gi_status: "",
    fun_fact: "",
    key_takeaways: "",
    swot_strengths: "",
    swot_weaknesses: "",
    swot_opportunities: "",
    swot_threats: "",
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [crops, searchTerm, seasonFilter, climateFilter]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCrops(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch crops",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = crops.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeason = seasonFilter === "all" || 
                           crop.season?.some(s => s.toLowerCase().includes(seasonFilter.toLowerCase()));
      
      const matchesClimate = climateFilter === "all" || 
                             crop.climate_type?.some(c => c.toLowerCase().includes(climateFilter.toLowerCase()));
      
      return matchesSearch && matchesSeason && matchesClimate;
    });
    
    setFilteredCrops(filtered);
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cropData = {
        name: formData.name,
        scientific_name: formData.scientific_name,
        description: formData.description,
        season: formData.season.split(',').map(s => s.trim()).filter(Boolean),
        climate_type: formData.climate_type.split(',').map(s => s.trim()).filter(Boolean),
        soil_type: formData.soil_type.split(',').map(s => s.trim()).filter(Boolean),
        water_requirement: formData.water_requirement,
        growth_duration: formData.growth_duration,
        family: formData.family,
        temperature_range: formData.temperature_range,
        rainfall_requirement: formData.rainfall_requirement,
        humidity_range: formData.humidity_range,
        soil_ph: formData.soil_ph,
        drainage_requirement: formData.drainage_requirement,
        land_preparation: formData.land_preparation.split(',').map(s => s.trim()).filter(Boolean),
        seed_rate: formData.seed_rate,
        row_spacing: formData.row_spacing,
        sowing_time: formData.sowing_time,
        fertilizer_requirement: formData.fertilizer_requirement.split(',').map(s => s.trim()).filter(Boolean),
        irrigation_schedule: formData.irrigation_schedule.split(',').map(s => s.trim()).filter(Boolean),
        harvesting_info: formData.harvesting_info.split(',').map(s => s.trim()).filter(Boolean),
        pest_list: formData.pest_list.split(',').map(s => s.trim()).filter(Boolean),
        disease_list: formData.disease_list.split(',').map(s => s.trim()).filter(Boolean),
        average_yield: formData.average_yield,
        market_price: formData.market_price,
        cost_of_cultivation: formData.cost_of_cultivation,
        nutritional_info: formData.nutritional_info,
        sustainability_practices: formData.sustainability_practices.split(',').map(s => s.trim()).filter(Boolean),
        innovations: formData.innovations.split(',').map(s => s.trim()).filter(Boolean),
        // New fields from the expanded form structure
        root_system: formData.root_system,
        leaf: formData.leaf,
        chromosome_number: formData.chromosome_number,
        origin: formData.origin,
        field_name: formData.field_name,
        climate_zone: formData.climate_zone,
        growth_habit: formData.growth_habit,
        life_span: formData.life_span,
        plant_type: formData.plant_type,
        flowering_season: formData.flowering_season,
        inflorescence_type: formData.inflorescence_type,
        fruit_type: formData.fruit_type,
        fruit_development: formData.fruit_development,
        unique_morphology: formData.unique_morphology,
        edible_part: formData.edible_part,
        breeding_methods: formData.breeding_methods,
        biotech_advances: formData.biotech_advances,
        hybrid_varieties: formData.hybrid_varieties,
        patents: formData.patents,
        research_institutes: formData.research_institutes,
        pollination: formData.pollination,
        propagation_type: formData.propagation_type,
        planting_material: formData.planting_material,
        germination_percent: formData.germination_percent,
        rootstock_compatibility: formData.rootstock_compatibility,
        nursery_practices: formData.nursery_practices,
        training_system: formData.training_system,
        spacing: formData.spacing,
        planting_season: formData.planting_season,
        npk_n: formData.npk_n,
        npk_p: formData.npk_p,
        npk_k: formData.npk_k,
        micronutrient_needs: formData.micronutrient_needs,
        biofertilizer_usage: formData.biofertilizer_usage,
        application_schedule_method: formData.application_schedule_method,
        application_schedule_stages: formData.application_schedule_stages,
        application_schedule_frequency: formData.application_schedule_frequency,
        water_quality: formData.water_quality,
        optimum_temp: formData.optimum_temp,
        tolerable_temp: formData.tolerable_temp,
        altitude: formData.altitude,
        soil_texture: formData.soil_texture,
        light_requirement: formData.light_requirement,
        common_weeds: formData.common_weeds,
        weed_season: formData.weed_season,
        weed_control_method: formData.weed_control_method,
        critical_period_weed: formData.critical_period_weed,
        pest_name: formData.pest_name,
        pest_symptoms: formData.pest_symptoms,
        pest_life_cycle: formData.pest_life_cycle,
        pest_etl: formData.pest_etl,
        pest_management: formData.pest_management,
        pest_biocontrol: formData.pest_biocontrol,
        disease_name: formData.disease_name,
        disease_causal_agent: formData.disease_causal_agent,
        disease_symptoms: formData.disease_symptoms,
        disease_life_cycle: formData.disease_life_cycle,
        disease_management: formData.disease_management,
        disease_biocontrol: formData.disease_biocontrol,
        disorder_name: formData.disorder_name,
        disorder_cause: formData.disorder_cause,
        disorder_symptoms: formData.disorder_symptoms,
        disorder_impact: formData.disorder_impact,
        disorder_control: formData.disorder_control,
        nematode_name: formData.nematode_name,
        nematode_symptoms: formData.nematode_symptoms,
        nematode_life_cycle: formData.nematode_life_cycle,
        nematode_etl: formData.nematode_etl,
        nematode_management: formData.nematode_management,
        nematode_biocontrol: formData.nematode_biocontrol,
        calories: formData.calories,
        protein: formData.protein,
        carbohydrates: formData.carbohydrates,
        fat: formData.fat,
        fiber: formData.fiber,
        vitamins: formData.vitamins,
        minerals: formData.minerals,
        bioactive_compounds: formData.bioactive_compounds,
        health_benefits: formData.health_benefits,
        variety_name: formData.variety_name,
        yield: formData.yield,
        variety_features: formData.variety_features,
        variety_suitability: formData.variety_suitability,
        market_demand: formData.market_demand,
        harvest_time: formData.harvest_time,
        maturity_indicators: formData.maturity_indicators,
        harvesting_tools: formData.harvesting_tools,
        post_harvest_losses: formData.post_harvest_losses,
        storage_conditions: formData.storage_conditions,
        shelf_life: formData.shelf_life,
        processed_products: formData.processed_products,
        packaging_types: formData.packaging_types,
        cold_chain: formData.cold_chain,
        ripening_characteristics: formData.ripening_characteristics,
        pre_cooling: formData.pre_cooling,
        market_trends: formData.market_trends,
        export_potential: formData.export_potential,
        export_destinations: formData.export_destinations,
        value_chain_players: formData.value_chain_players,
        certifications: formData.certifications,
        subsidies: formData.subsidies,
        schemes: formData.schemes,
        support_agencies: formData.support_agencies,
        ai_ml_iot: formData.ai_ml_iot,
        smart_farming: formData.smart_farming,
        sustainability_potential: formData.sustainability_potential,
        waste_to_wealth: formData.waste_to_wealth,
        climate_resilience: formData.climate_resilience,
        carbon_footprint: formData.carbon_footprint,
        religious_use: formData.religious_use,
        traditional_uses: formData.traditional_uses,
        gi_status: formData.gi_status,
        fun_fact: formData.fun_fact,
        key_takeaways: formData.key_takeaways,
        swot_strengths: formData.swot_strengths,
        swot_weaknesses: formData.swot_weaknesses,
        swot_opportunities: formData.swot_opportunities,
        swot_threats: formData.swot_threats,
      };

      console.log('Saving crop data:', cropData);

      if (editingCrop) {
        const { error } = await supabase
          .from('crops')
          .update(cropData)
          .eq('id', editingCrop.id);
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        toast({ title: "Success", description: "Crop updated successfully" });
      } else {
        const { error } = await supabase
          .from('crops')
          .insert([cropData]);
        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        toast({ title: "Success", description: "Crop created successfully" });
      }

      setIsDialogOpen(false);
      setEditingCrop(null);
      resetForm();
      fetchCrops();
    } catch (error) {
      console.error('Full error details:', error);
      toast({
        title: "Error",
        description: `Failed to save crop: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      scientific_name: crop.scientific_name || "",
      description: crop.description || "",
      season: crop.season?.join(', ') || "",
      climate_type: crop.climate_type?.join(', ') || "",
      soil_type: crop.soil_type?.join(', ') || "",
      water_requirement: crop.water_requirement || "",
      growth_duration: crop.growth_duration || "",
      family: crop.family || "",
      temperature_range: crop.temperature_range || "",
      rainfall_requirement: crop.rainfall_requirement || "",
      humidity_range: crop.humidity_range || "",
      soil_ph: crop.soil_ph || "",
      drainage_requirement: crop.drainage_requirement || "",
      land_preparation: crop.land_preparation?.join(', ') || "",
      seed_rate: crop.seed_rate || "",
      row_spacing: crop.row_spacing || "",
      sowing_time: crop.sowing_time || "",
      fertilizer_requirement: crop.fertilizer_requirement?.join(', ') || "",
      irrigation_schedule: crop.irrigation_schedule?.join(', ') || "",
      harvesting_info: crop.harvesting_info?.join(', ') || "",
      pest_list: crop.pest_list?.join(', ') || "",
      disease_list: crop.disease_list?.join(', ') || "",
      average_yield: crop.average_yield || "",
      market_price: crop.market_price || "",
      cost_of_cultivation: crop.cost_of_cultivation || "",
      nutritional_info: crop.nutritional_info || "",
      sustainability_practices: crop.sustainability_practices?.join(', ') || "",
      innovations: crop.innovations?.join(', ') || "",
      // New fields for the expanded form structure
      root_system: crop.root_system || "",
      leaf: crop.leaf || "",
      chromosome_number: crop.chromosome_number || "",
      origin: crop.origin || "",
      field_name: crop.field_name || "",
      climate_zone: crop.climate_zone || "",
      growth_habit: crop.growth_habit || "",
      life_span: crop.life_span || "",
      plant_type: crop.plant_type || "",
      flowering_season: crop.flowering_season || "",
      inflorescence_type: crop.inflorescence_type || "",
      fruit_type: crop.fruit_type || "",
      fruit_development: crop.fruit_development || "",
      unique_morphology: crop.unique_morphology || "",
      edible_part: crop.edible_part || "",
      breeding_methods: crop.breeding_methods || "",
      biotech_advances: crop.biotech_advances || "",
      hybrid_varieties: crop.hybrid_varieties || "",
      patents: crop.patents || "",
      research_institutes: crop.research_institutes || "",
      pollination: crop.pollination || "",
      propagation_type: crop.propagation_type || "",
      planting_material: crop.planting_material || "",
      germination_percent: crop.germination_percent || "",
      rootstock_compatibility: crop.rootstock_compatibility || "",
      nursery_practices: crop.nursery_practices || "",
      training_system: crop.training_system || "",
      spacing: crop.spacing || "",
      planting_season: crop.planting_season || "",
      npk_n: crop.npk_n || "",
      npk_p: crop.npk_p || "",
      npk_k: crop.npk_k || "",
      micronutrient_needs: crop.micronutrient_needs || "",
      biofertilizer_usage: crop.biofertilizer_usage || "",
      application_schedule_method: crop.application_schedule_method || "",
      application_schedule_stages: crop.application_schedule_stages || "",
      application_schedule_frequency: crop.application_schedule_frequency || "",
      water_quality: crop.water_quality || "",
      optimum_temp: crop.optimum_temp || "",
      tolerable_temp: crop.tolerable_temp || "",
      altitude: crop.altitude || "",
      soil_texture: crop.soil_texture || "",
      light_requirement: crop.light_requirement || "",
      common_weeds: crop.common_weeds || "",
      weed_season: crop.weed_season || "",
      weed_control_method: crop.weed_control_method || "",
      critical_period_weed: crop.critical_period_weed || "",
      pest_name: crop.pest_name || "",
      pest_symptoms: crop.pest_symptoms || "",
      pest_life_cycle: crop.pest_life_cycle || "",
      pest_etl: crop.pest_etl || "",
      pest_management: crop.pest_management || "",
      pest_biocontrol: crop.pest_biocontrol || "",
      disease_name: crop.disease_name || "",
      disease_causal_agent: crop.disease_causal_agent || "",
      disease_symptoms: crop.disease_symptoms || "",
      disease_life_cycle: crop.disease_life_cycle || "",
      disease_management: crop.disease_management || "",
      disease_biocontrol: crop.disease_biocontrol || "",
      disorder_name: crop.disorder_name || "",
      disorder_cause: crop.disorder_cause || "",
      disorder_symptoms: crop.disorder_symptoms || "",
      disorder_impact: crop.disorder_impact || "",
      disorder_control: crop.disorder_control || "",
      nematode_name: crop.nematode_name || "",
      nematode_symptoms: crop.nematode_symptoms || "",
      nematode_life_cycle: crop.nematode_life_cycle || "",
      nematode_etl: crop.nematode_etl || "",
      nematode_management: crop.nematode_management || "",
      nematode_biocontrol: crop.nematode_biocontrol || "",
      calories: crop.calories || "",
      protein: crop.protein || "",
      carbohydrates: crop.carbohydrates || "",
      fat: crop.fat || "",
      fiber: crop.fiber || "",
      vitamins: crop.vitamins || "",
      minerals: crop.minerals || "",
      bioactive_compounds: crop.bioactive_compounds || "",
      health_benefits: crop.health_benefits || "",
      variety_name: crop.variety_name || "",
      yield: crop.yield || "",
      variety_features: crop.variety_features || "",
      variety_suitability: crop.variety_suitability || "",
      market_demand: crop.market_demand || "",
      harvest_time: crop.harvest_time || "",
      maturity_indicators: crop.maturity_indicators || "",
      harvesting_tools: crop.harvesting_tools || "",
      post_harvest_losses: crop.post_harvest_losses || "",
      storage_conditions: crop.storage_conditions || "",
      shelf_life: crop.shelf_life || "",
      processed_products: crop.processed_products || "",
      packaging_types: crop.packaging_types || "",
      cold_chain: crop.cold_chain || "",
      ripening_characteristics: crop.ripening_characteristics || "",
      pre_cooling: crop.pre_cooling || "",
      market_trends: crop.market_trends || "",
      export_potential: crop.export_potential || "",
      export_destinations: crop.export_destinations || "",
      value_chain_players: crop.value_chain_players || "",
      certifications: crop.certifications || "",
      subsidies: crop.subsidies || "",
      schemes: crop.schemes || "",
      support_agencies: crop.support_agencies || "",
      ai_ml_iot: crop.ai_ml_iot || "",
      smart_farming: crop.smart_farming || "",
      sustainability_potential: crop.sustainability_potential || "",
      waste_to_wealth: crop.waste_to_wealth || "",
      climate_resilience: crop.climate_resilience || "",
      carbon_footprint: crop.carbon_footprint || "",
      religious_use: crop.religious_use || "",
      traditional_uses: crop.traditional_uses || "",
      gi_status: crop.gi_status || "",
      fun_fact: crop.fun_fact || "",
      key_takeaways: crop.key_takeaways || "",
      swot_strengths: crop.swot_strengths || "",
      swot_weaknesses: crop.swot_weaknesses || "",
      swot_opportunities: crop.swot_opportunities || "",
      swot_threats: crop.swot_threats || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this crop?")) return;

    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Crop deleted successfully" });
      fetchCrops();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crop",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCrops.length === 0) {
      toast({
        title: "Warning",
        description: "Please select crops to delete",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedCrops.length} crops?`)) return;

    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .in('id', selectedCrops);
      
      if (error) throw error;
      toast({ title: "Success", description: `${selectedCrops.length} crops deleted successfully` });
      setSelectedCrops([]);
      fetchCrops();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crops",
        variant: "destructive"
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCrops(paginatedCrops.map(crop => crop.id));
    } else {
      setSelectedCrops([]);
    }
  };

  const handleSelectCrop = (cropId: string, checked: boolean) => {
    if (checked) {
      setSelectedCrops(prev => [...prev, cropId]);
    } else {
      setSelectedCrops(prev => prev.filter(id => id !== cropId));
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Scientific Name,Description,Season,Climate Type,Soil Type\n"
      + filteredCrops.map(crop => 
          `"${crop.name}","${crop.scientific_name || ''}","${crop.description || ''}","${crop.season?.join('; ') || ''}","${crop.climate_type?.join('; ') || ''}","${crop.soil_type?.join('; ') || ''}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "crops_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTemplateSelect = (template: CropTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    
    // Pre-fill form with template defaults
    if (template.defaultValues) {
      // Convert template defaults to match form data structure
      const templateDefaults = Object.entries(template.defaultValues).reduce((acc, [key, value]) => {
        if (key === 'season' && Array.isArray(value)) {
          acc[key] = value.join(', ');
        } else if (key === 'land_preparation' && Array.isArray(value)) {
          acc[key] = value.join(', ');
        } else if (typeof value === 'string') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      setFormData(prev => ({
        ...prev,
        ...templateDefaults,
        // Keep existing values for fields that shouldn't be overridden
        name: prev.name,
        scientific_name: prev.scientific_name,
        description: prev.description
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", scientific_name: "", description: "", season: "", climate_type: "",
      soil_type: "", water_requirement: "", growth_duration: "", family: "",
      temperature_range: "", rainfall_requirement: "", humidity_range: "",
      soil_ph: "", drainage_requirement: "", land_preparation: "", seed_rate: "",
      row_spacing: "", sowing_time: "", fertilizer_requirement: "", irrigation_schedule: "",
      harvesting_info: "", pest_list: "", disease_list: "", average_yield: "",
      market_price: "", cost_of_cultivation: "", nutritional_info: "",
      sustainability_practices: "", innovations: "",
      // New fields for the expanded form structure
      root_system: "", leaf: "", chromosome_number: "", origin: "",
      field_name: "", climate_zone: "", growth_habit: "", life_span: "", plant_type: "",
      flowering_season: "", inflorescence_type: "", fruit_type: "", fruit_development: "",
      unique_morphology: "", edible_part: "", breeding_methods: "", biotech_advances: "",
      hybrid_varieties: "", patents: "", research_institutes: "", pollination: "",
      propagation_type: "", planting_material: "", germination_percent: "",
      rootstock_compatibility: "", nursery_practices: "", training_system: "",
      spacing: "", planting_season: "", npk_n: "", npk_p: "", npk_k: "",
      micronutrient_needs: "", biofertilizer_usage: "", application_schedule_method: "",
      application_schedule_stages: "", application_schedule_frequency: "",
      water_quality: "", optimum_temp: "", tolerable_temp: "", altitude: "",
      soil_texture: "", light_requirement: "", common_weeds: "", weed_season: "",
      weed_control_method: "", critical_period_weed: "", pest_name: "", pest_symptoms: "",
      pest_life_cycle: "", pest_etl: "", pest_management: "", pest_biocontrol: "",
      disease_name: "", disease_causal_agent: "", disease_symptoms: "", disease_life_cycle: "",
      disease_management: "", disease_biocontrol: "", disorder_name: "", disorder_cause: "",
      disorder_symptoms: "", disorder_impact: "", disorder_control: "", nematode_name: "",
      nematode_symptoms: "", nematode_life_cycle: "", nematode_etl: "", nematode_management: "",
      nematode_biocontrol: "", calories: "", protein: "", carbohydrates: "", fat: "",
      fiber: "", vitamins: "", minerals: "", bioactive_compounds: "", health_benefits: "",
      variety_name: "", yield: "", variety_features: "", variety_suitability: "",
      market_demand: "", harvest_time: "", maturity_indicators: "", harvesting_tools: "",
      post_harvest_losses: "", storage_conditions: "", shelf_life: "", processed_products: "",
      packaging_types: "", cold_chain: "", ripening_characteristics: "", pre_cooling: "",
      market_trends: "", export_potential: "", export_destinations: "", value_chain_players: "",
      certifications: "", subsidies: "", schemes: "", support_agencies: "", ai_ml_iot: "",
      smart_farming: "", sustainability_potential: "", waste_to_wealth: "", climate_resilience: "",
      carbon_footprint: "", religious_use: "", traditional_uses: "", gi_status: "",
      fun_fact: "", key_takeaways: "", swot_strengths: "", swot_weaknesses: "",
      swot_opportunities: "", swot_threats: "",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSeasonFilter("all");
    setClimateFilter("all");
  };

  // Pagination
  const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCrops = filteredCrops.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Enhanced Crop Management</CardTitle>
            <CardDescription>Advanced crop management with search, filters, and bulk operations</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={fetchCrops}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {selectedCrops.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedCrops.length})
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { 
                  setEditingCrop(null); 
                  setSelectedTemplate(null);
                  setShowTemplateSelector(true);
                  resetForm(); 
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Crop
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-6xl h-[90vh] max-h-[90vh] p-0 flex flex-col">
                <DialogHeader className="px-6 pt-6 pb-2">
                  <DialogTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</DialogTitle>
                  <DialogDescription>
                    {editingCrop ? "Update crop information" : "Enter detailed crop information"}
                  </DialogDescription>
                  {!editingCrop && selectedTemplate && (
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowTemplateSelector(true);
                          setSelectedTemplate(null);
                        }}
                      >
                        ← Change Template
                      </Button>
                      <Badge variant="outline" className="ml-2">
                        Using: {selectedTemplate.name}
                      </Badge>
                    </div>
                  )}
                </DialogHeader>
                
                {!editingCrop && showTemplateSelector ? (
                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <CropTemplateSelector
                      onTemplateSelect={handleTemplateSelect}
                      selectedTemplateId={selectedTemplate?.id}
                    />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="flex flex-wrap gap-2 mb-4 px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                      <TabsTrigger value="basic">Basic Identification</TabsTrigger>
                      <TabsTrigger value="morphology">Morphology & Anatomy</TabsTrigger>
                      <TabsTrigger value="genetics">Genetic Info</TabsTrigger>
                      <TabsTrigger value="repro">Reproductive Biology</TabsTrigger>
                      <TabsTrigger value="cultivation">Cultivation</TabsTrigger>
                      <TabsTrigger value="climate">Climate & Soil</TabsTrigger>
                      <TabsTrigger value="pest">Pest Mgmt</TabsTrigger>
                      <TabsTrigger value="disease">Disease Mgmt</TabsTrigger>
                      <TabsTrigger value="nematode">Nematode Mgmt</TabsTrigger>
                      <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                      <TabsTrigger value="varieties">Varieties & Yield</TabsTrigger>
                      <TabsTrigger value="harvest">Harvest</TabsTrigger>
                      <TabsTrigger value="market">Market</TabsTrigger>
                      <TabsTrigger value="govt">Govt Support</TabsTrigger>
                      <TabsTrigger value="tech">Tech & Innovation</TabsTrigger>
                      <TabsTrigger value="sustain">Sustainability</TabsTrigger>
                      <TabsTrigger value="cultural">Cultural</TabsTrigger>
                      <TabsTrigger value="insights">Insights</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                      <TabsContent value="basic">
                        <div className="space-y-8">
                      <div>
                            <h3 className="text-lg font-semibold mb-2">Basic Plant Identification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="name">Common Name *</Label>
                                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                      <div>
                                <Label htmlFor="scientific_name">Botanical Name</Label>
                                <Input id="scientific_name" value={formData.scientific_name} onChange={e => setFormData({ ...formData, scientific_name: e.target.value })} />
                      </div>
                              <div>
                                <Label htmlFor="field_name">Field Name</Label>
                                <Input id="field_name" value={formData.field_name || ''} onChange={e => setFormData({ ...formData, field_name: e.target.value })} />
                    </div>
                    <div>
                                <Label htmlFor="family">Family</Label>
                                <Input id="family" value={formData.family} onChange={e => setFormData({ ...formData, family: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="origin">Origin / Center of Origin</Label>
                                <Input id="origin" value={formData.origin || ''} onChange={e => setFormData({ ...formData, origin: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="climate_zone">Climate Zone</Label>
                                <Input id="climate_zone" value={formData.climate_zone || ''} onChange={e => setFormData({ ...formData, climate_zone: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="growth_habit">Growth Habit</Label>
                                <Input id="growth_habit" value={formData.growth_habit || ''} onChange={e => setFormData({ ...formData, growth_habit: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="life_span">Life Span</Label>
                                <Input id="life_span" value={formData.life_span || ''} onChange={e => setFormData({ ...formData, life_span: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="plant_type">Plant Type</Label>
                                <Input id="plant_type" value={formData.plant_type || ''} onChange={e => setFormData({ ...formData, plant_type: e.target.value })} />
                              </div>
                              <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                    </div>
                  </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="morphology">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Morphology & Anatomy</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="root_system">Root System</Label>
                                <Input id="root_system" value={formData.root_system || ''} onChange={e => setFormData({ ...formData, root_system: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="leaf">Leaf</Label>
                                <Input id="leaf" value={formData.leaf || ''} onChange={e => setFormData({ ...formData, leaf: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="flowering_season">Flowering Season</Label>
                                <Input id="flowering_season" value={formData.flowering_season || ''} onChange={e => setFormData({ ...formData, flowering_season: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="inflorescence_type">Inflorescence Type</Label>
                                <Input id="inflorescence_type" value={formData.inflorescence_type || ''} onChange={e => setFormData({ ...formData, inflorescence_type: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="fruit_type">Fruit Type</Label>
                                <Input id="fruit_type" value={formData.fruit_type || ''} onChange={e => setFormData({ ...formData, fruit_type: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="fruit_development">Fruit Development Process</Label>
                                <Input id="fruit_development" value={formData.fruit_development || ''} onChange={e => setFormData({ ...formData, fruit_development: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="unique_morphology">Unique Morphological Features</Label>
                                <Input id="unique_morphology" value={formData.unique_morphology || ''} onChange={e => setFormData({ ...formData, unique_morphology: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="edible_part">Edible Part</Label>
                                <Input id="edible_part" value={formData.edible_part || ''} onChange={e => setFormData({ ...formData, edible_part: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="genetics">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Genetic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="chromosome_number">Chromosome Number</Label>
                                <Input id="chromosome_number" value={formData.chromosome_number || ''} onChange={e => setFormData({ ...formData, chromosome_number: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="breeding_methods">Breeding Methods Used</Label>
                                <Input id="breeding_methods" value={formData.breeding_methods || ''} onChange={e => setFormData({ ...formData, breeding_methods: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="biotech_advances">Biotechnological Advances</Label>
                                <Input id="biotech_advances" value={formData.biotech_advances || ''} onChange={e => setFormData({ ...formData, biotech_advances: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="hybrid_varieties">Hybrid Varieties</Label>
                                <Input id="hybrid_varieties" value={formData.hybrid_varieties || ''} onChange={e => setFormData({ ...formData, hybrid_varieties: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="patents">Patents / GI Tag</Label>
                                <Input id="patents" value={formData.patents || ''} onChange={e => setFormData({ ...formData, patents: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="research_institutes">Research Institutes</Label>
                                <Input id="research_institutes" value={formData.research_institutes || ''} onChange={e => setFormData({ ...formData, research_institutes: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="repro">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Reproductive Biology</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="pollination">Pollination (Type & Agents)</Label>
                                <Input id="pollination" value={formData.pollination || ''} onChange={e => setFormData({ ...formData, pollination: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="propagation_type">Propagation Type (Seed/Vegetative)</Label>
                                <Input id="propagation_type" value={formData.propagation_type || ''} onChange={e => setFormData({ ...formData, propagation_type: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="planting_material">Planting Material</Label>
                                <Input id="planting_material" value={formData.planting_material || ''} onChange={e => setFormData({ ...formData, planting_material: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="germination_percent">Germination / Rooting %</Label>
                                <Input id="germination_percent" value={formData.germination_percent || ''} onChange={e => setFormData({ ...formData, germination_percent: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="rootstock_compatibility">Rootstock Compatibility</Label>
                                <Input id="rootstock_compatibility" value={formData.rootstock_compatibility || ''} onChange={e => setFormData({ ...formData, rootstock_compatibility: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="nursery_practices">Nursery Practices</Label>
                                <Input id="nursery_practices" value={formData.nursery_practices || ''} onChange={e => setFormData({ ...formData, nursery_practices: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="training_system">Training System</Label>
                                <Input id="training_system" value={formData.training_system || ''} onChange={e => setFormData({ ...formData, training_system: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="cultivation">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Cultivation Practices</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="spacing">Spacing</Label>
                                <Input id="spacing" value={formData.spacing || ''} onChange={e => setFormData({ ...formData, spacing: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="seed_rate">Seed Rate / Planting Units</Label>
                                <Input id="seed_rate" value={formData.seed_rate || ''} onChange={e => setFormData({ ...formData, seed_rate: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="planting_season">Planting Season</Label>
                                <Input id="planting_season" value={formData.planting_season || ''} onChange={e => setFormData({ ...formData, planting_season: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="npk_n">NPK Recommendation - N</Label>
                                <Input id="npk_n" value={formData.npk_n || ''} onChange={e => setFormData({ ...formData, npk_n: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="npk_p">NPK Recommendation - P</Label>
                                <Input id="npk_p" value={formData.npk_p || ''} onChange={e => setFormData({ ...formData, npk_p: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="npk_k">NPK Recommendation - K</Label>
                                <Input id="npk_k" value={formData.npk_k || ''} onChange={e => setFormData({ ...formData, npk_k: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="micronutrient_needs">Micronutrient Needs</Label>
                                <Input id="micronutrient_needs" value={formData.micronutrient_needs || ''} onChange={e => setFormData({ ...formData, micronutrient_needs: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="biofertilizer_usage">Biofertilizer Usage</Label>
                                <Input id="biofertilizer_usage" value={formData.biofertilizer_usage || ''} onChange={e => setFormData({ ...formData, biofertilizer_usage: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="application_schedule_method">Application Schedule - Method</Label>
                                <Input id="application_schedule_method" value={formData.application_schedule_method || ''} onChange={e => setFormData({ ...formData, application_schedule_method: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="application_schedule_stages">Application Schedule - Critical Stages</Label>
                                <Input id="application_schedule_stages" value={formData.application_schedule_stages || ''} onChange={e => setFormData({ ...formData, application_schedule_stages: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="application_schedule_frequency">Application Schedule - Frequency</Label>
                                <Input id="application_schedule_frequency" value={formData.application_schedule_frequency || ''} onChange={e => setFormData({ ...formData, application_schedule_frequency: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="irrigation">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Irrigation & Water Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="water_requirement">Water Requirement / Cycle</Label>
                                <Input id="water_requirement" value={formData.water_requirement || ''} onChange={e => setFormData({ ...formData, water_requirement: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="water_quality">Water Quality Considerations (Salinity Tolerance)</Label>
                                <Input id="water_quality" value={formData.water_quality || ''} onChange={e => setFormData({ ...formData, water_quality: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="climate">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Climate & Soil Requirements</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="optimum_temp">Optimum Temperature Range</Label>
                                <Input id="optimum_temp" value={formData.optimum_temp || ''} onChange={e => setFormData({ ...formData, optimum_temp: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="tolerable_temp">Tolerable Temperature Range</Label>
                                <Input id="tolerable_temp" value={formData.tolerable_temp || ''} onChange={e => setFormData({ ...formData, tolerable_temp: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="rainfall_requirement">Rainfall Requirement</Label>
                                <Input id="rainfall_requirement" value={formData.rainfall_requirement || ''} onChange={e => setFormData({ ...formData, rainfall_requirement: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="altitude">Altitude</Label>
                                <Input id="altitude" value={formData.altitude || ''} onChange={e => setFormData({ ...formData, altitude: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="soil_type">Soil Type</Label>
                                <Input id="soil_type" value={formData.soil_type || ''} onChange={e => setFormData({ ...formData, soil_type: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="soil_texture">Soil Texture</Label>
                                <Input id="soil_texture" value={formData.soil_texture || ''} onChange={e => setFormData({ ...formData, soil_texture: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="soil_ph">pH Range</Label>
                                <Input id="soil_ph" value={formData.soil_ph || ''} onChange={e => setFormData({ ...formData, soil_ph: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="drainage_requirement">Drainage Requirements</Label>
                                <Input id="drainage_requirement" value={formData.drainage_requirement || ''} onChange={e => setFormData({ ...formData, drainage_requirement: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="light_requirement">Light Requirement</Label>
                                <Input id="light_requirement" value={formData.light_requirement || ''} onChange={e => setFormData({ ...formData, light_requirement: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="weed">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Weed Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="common_weeds">Common Weeds</Label>
                                <Input id="common_weeds" value={formData.common_weeds || ''} onChange={e => setFormData({ ...formData, common_weeds: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="weed_season">Season</Label>
                                <Input id="weed_season" value={formData.weed_season || ''} onChange={e => setFormData({ ...formData, weed_season: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="weed_control_method">Control Method</Label>
                                <Input id="weed_control_method" value={formData.weed_control_method || ''} onChange={e => setFormData({ ...formData, weed_control_method: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="critical_period_weed">Critical Period for Weed Competition</Label>
                                <Input id="critical_period_weed" value={formData.critical_period_weed || ''} onChange={e => setFormData({ ...formData, critical_period_weed: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="pest">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Pest Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="pest_name">Pest Name</Label>
                                <Input id="pest_name" value={formData.pest_name || ''} onChange={e => setFormData({ ...formData, pest_name: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="pest_symptoms">Symptoms</Label>
                                <Input id="pest_symptoms" value={formData.pest_symptoms || ''} onChange={e => setFormData({ ...formData, pest_symptoms: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="pest_life_cycle">Life Cycle</Label>
                                <Input id="pest_life_cycle" value={formData.pest_life_cycle || ''} onChange={e => setFormData({ ...formData, pest_life_cycle: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="pest_etl">ETL (Economic Threshold Level)</Label>
                                <Input id="pest_etl" value={formData.pest_etl || ''} onChange={e => setFormData({ ...formData, pest_etl: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="pest_management">Management (Bio/Chemical)</Label>
                                <Input id="pest_management" value={formData.pest_management || ''} onChange={e => setFormData({ ...formData, pest_management: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="pest_biocontrol">Biocontrol Agents</Label>
                                <Input id="pest_biocontrol" value={formData.pest_biocontrol || ''} onChange={e => setFormData({ ...formData, pest_biocontrol: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="disease">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Disease Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="disease_name">Disease Name</Label>
                                <Input id="disease_name" value={formData.disease_name || ''} onChange={e => setFormData({ ...formData, disease_name: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disease_causal_agent">Causal Agent</Label>
                                <Input id="disease_causal_agent" value={formData.disease_causal_agent || ''} onChange={e => setFormData({ ...formData, disease_causal_agent: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disease_symptoms">Symptoms</Label>
                                <Input id="disease_symptoms" value={formData.disease_symptoms || ''} onChange={e => setFormData({ ...formData, disease_symptoms: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disease_life_cycle">Life Cycle</Label>
                                <Input id="disease_life_cycle" value={formData.disease_life_cycle || ''} onChange={e => setFormData({ ...formData, disease_life_cycle: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disease_management">Management</Label>
                                <Input id="disease_management" value={formData.disease_management || ''} onChange={e => setFormData({ ...formData, disease_management: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disease_biocontrol">Biocontrol Agents</Label>
                                <Input id="disease_biocontrol" value={formData.disease_biocontrol || ''} onChange={e => setFormData({ ...formData, disease_biocontrol: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="physio">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Physiological Disorders</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="disorder_name">Disorder Name</Label>
                                <Input id="disorder_name" value={formData.disorder_name || ''} onChange={e => setFormData({ ...formData, disorder_name: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disorder_cause">Cause</Label>
                                <Input id="disorder_cause" value={formData.disorder_cause || ''} onChange={e => setFormData({ ...formData, disorder_cause: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disorder_symptoms">Symptoms</Label>
                                <Input id="disorder_symptoms" value={formData.disorder_symptoms || ''} onChange={e => setFormData({ ...formData, disorder_symptoms: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disorder_impact">Impact on Yield/Quality</Label>
                                <Input id="disorder_impact" value={formData.disorder_impact || ''} onChange={e => setFormData({ ...formData, disorder_impact: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="disorder_control">Control</Label>
                                <Input id="disorder_control" value={formData.disorder_control || ''} onChange={e => setFormData({ ...formData, disorder_control: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="nematode">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Nematode Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="nematode_name">Nematode Name</Label>
                                <Input id="nematode_name" value={formData.nematode_name || ''} onChange={e => setFormData({ ...formData, nematode_name: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="nematode_symptoms">Symptoms</Label>
                                <Input id="nematode_symptoms" value={formData.nematode_symptoms || ''} onChange={e => setFormData({ ...formData, nematode_symptoms: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="nematode_life_cycle">Life Cycle</Label>
                                <Input id="nematode_life_cycle" value={formData.nematode_life_cycle || ''} onChange={e => setFormData({ ...formData, nematode_life_cycle: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="nematode_etl">ETL (if known)</Label>
                                <Input id="nematode_etl" value={formData.nematode_etl || ''} onChange={e => setFormData({ ...formData, nematode_etl: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="nematode_management">Management Strategies</Label>
                                <Input id="nematode_management" value={formData.nematode_management || ''} onChange={e => setFormData({ ...formData, nematode_management: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="nematode_biocontrol">Biocontrol Agents</Label>
                                <Input id="nematode_biocontrol" value={formData.nematode_biocontrol || ''} onChange={e => setFormData({ ...formData, nematode_biocontrol: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="nutrition">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Nutritional Composition</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="calories">Calories</Label>
                                <Input id="calories" value={formData.calories || ''} onChange={e => setFormData({ ...formData, calories: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="protein">Protein</Label>
                                <Input id="protein" value={formData.protein || ''} onChange={e => setFormData({ ...formData, protein: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="carbohydrates">Carbohydrates</Label>
                                <Input id="carbohydrates" value={formData.carbohydrates || ''} onChange={e => setFormData({ ...formData, carbohydrates: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="fat">Fat</Label>
                                <Input id="fat" value={formData.fat || ''} onChange={e => setFormData({ ...formData, fat: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="fiber">Fiber</Label>
                                <Input id="fiber" value={formData.fiber || ''} onChange={e => setFormData({ ...formData, fiber: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="vitamins">Vitamins (A, B, C, etc.)</Label>
                                <Input id="vitamins" value={formData.vitamins || ''} onChange={e => setFormData({ ...formData, vitamins: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="minerals">Minerals (Fe, Ca, Zn)</Label>
                                <Input id="minerals" value={formData.minerals || ''} onChange={e => setFormData({ ...formData, minerals: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="bioactive_compounds">Bioactive Compounds / Phytochemicals</Label>
                                <Input id="bioactive_compounds" value={formData.bioactive_compounds || ''} onChange={e => setFormData({ ...formData, bioactive_compounds: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="health_benefits">Specific Health Benefits</Label>
                                <Input id="health_benefits" value={formData.health_benefits || ''} onChange={e => setFormData({ ...formData, health_benefits: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="varieties">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Varieties & Yield</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="variety_name">Variety Name</Label>
                                <Input id="variety_name" value={formData.variety_name || ''} onChange={e => setFormData({ ...formData, variety_name: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="yield">Yield (per plant / per acre)</Label>
                                <Input id="yield" value={formData.yield || ''} onChange={e => setFormData({ ...formData, yield: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="variety_features">Features</Label>
                                <Input id="variety_features" value={formData.variety_features || ''} onChange={e => setFormData({ ...formData, variety_features: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="variety_suitability">Suitability</Label>
                                <Input id="variety_suitability" value={formData.variety_suitability || ''} onChange={e => setFormData({ ...formData, variety_suitability: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="market_demand">Market Demand/Popularity</Label>
                                <Input id="market_demand" value={formData.market_demand || ''} onChange={e => setFormData({ ...formData, market_demand: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="harvest">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Harvest & Post-Harvest</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="harvest_time">Harvest Time</Label>
                                <Input id="harvest_time" value={formData.harvest_time || ''} onChange={e => setFormData({ ...formData, harvest_time: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="maturity_indicators">Maturity Indicators</Label>
                                <Input id="maturity_indicators" value={formData.maturity_indicators || ''} onChange={e => setFormData({ ...formData, maturity_indicators: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="harvesting_tools">Harvesting Tools</Label>
                                <Input id="harvesting_tools" value={formData.harvesting_tools || ''} onChange={e => setFormData({ ...formData, harvesting_tools: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="post_harvest_losses">Post-Harvest Losses %</Label>
                                <Input id="post_harvest_losses" value={formData.post_harvest_losses || ''} onChange={e => setFormData({ ...formData, post_harvest_losses: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="storage_conditions">Storage Conditions</Label>
                                <Input id="storage_conditions" value={formData.storage_conditions || ''} onChange={e => setFormData({ ...formData, storage_conditions: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="shelf_life">Shelf Life</Label>
                                <Input id="shelf_life" value={formData.shelf_life || ''} onChange={e => setFormData({ ...formData, shelf_life: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="processed_products">Processed Products</Label>
                                <Input id="processed_products" value={formData.processed_products || ''} onChange={e => setFormData({ ...formData, processed_products: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="packaging_types">Packaging Types</Label>
                                <Input id="packaging_types" value={formData.packaging_types || ''} onChange={e => setFormData({ ...formData, packaging_types: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="cold_chain">Cold Chain Requirement</Label>
                                <Input id="cold_chain" value={formData.cold_chain || ''} onChange={e => setFormData({ ...formData, cold_chain: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="ripening_characteristics">Ripening Characteristics (Climacteric / Non-climacteric)</Label>
                                <Input id="ripening_characteristics" value={formData.ripening_characteristics || ''} onChange={e => setFormData({ ...formData, ripening_characteristics: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="pre_cooling">Pre-cooling Requirements</Label>
                                <Input id="pre_cooling" value={formData.pre_cooling || ''} onChange={e => setFormData({ ...formData, pre_cooling: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="market">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Market & Economics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="market_price">Average Market Price (Rs/kg)</Label>
                                <Input id="market_price" value={formData.market_price || ''} onChange={e => setFormData({ ...formData, market_price: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="market_trends">Current Market Trends</Label>
                                <Input id="market_trends" value={formData.market_trends || ''} onChange={e => setFormData({ ...formData, market_trends: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="export_potential">Export Potential</Label>
                                <Input id="export_potential" value={formData.export_potential || ''} onChange={e => setFormData({ ...formData, export_potential: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="export_destinations">Export Destinations</Label>
                                <Input id="export_destinations" value={formData.export_destinations || ''} onChange={e => setFormData({ ...formData, export_destinations: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="value_chain_players">Value Chain Players</Label>
                                <Input id="value_chain_players" value={formData.value_chain_players || ''} onChange={e => setFormData({ ...formData, value_chain_players: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="certifications">Certifications Required</Label>
                                <Input id="certifications" value={formData.certifications || ''} onChange={e => setFormData({ ...formData, certifications: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="govt">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Government Support & Policy</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="subsidies">Available Subsidies</Label>
                                <Input id="subsidies" value={formData.subsidies || ''} onChange={e => setFormData({ ...formData, subsidies: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="schemes">Applicable Schemes</Label>
                                <Input id="schemes" value={formData.schemes || ''} onChange={e => setFormData({ ...formData, schemes: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="support_agencies">Support by NHB, MIDH, APEDA, etc.</Label>
                                <Input id="support_agencies" value={formData.support_agencies || ''} onChange={e => setFormData({ ...formData, support_agencies: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="tech">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Technology & Innovation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="ai_ml_iot">AI / ML / IoT Use Cases</Label>
                                <Input id="ai_ml_iot" value={formData.ai_ml_iot || ''} onChange={e => setFormData({ ...formData, ai_ml_iot: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="smart_farming">Smart Farming Scope</Label>
                                <Input id="smart_farming" value={formData.smart_farming || ''} onChange={e => setFormData({ ...formData, smart_farming: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="sustain">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Sustainability & Environment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="sustainability_potential">Sustainability Potential</Label>
                                <Input id="sustainability_potential" value={formData.sustainability_potential || ''} onChange={e => setFormData({ ...formData, sustainability_potential: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="waste_to_wealth">Waste-to-Wealth Ideas</Label>
                                <Input id="waste_to_wealth" value={formData.waste_to_wealth || ''} onChange={e => setFormData({ ...formData, waste_to_wealth: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="climate_resilience">Climate Change Resilience</Label>
                                <Input id="climate_resilience" value={formData.climate_resilience || ''} onChange={e => setFormData({ ...formData, climate_resilience: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="carbon_footprint">Carbon Footprint</Label>
                                <Input id="carbon_footprint" value={formData.carbon_footprint || ''} onChange={e => setFormData({ ...formData, carbon_footprint: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="cultural">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Cultural / Traditional Relevance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="religious_use">Religious / Cultural Use</Label>
                                <Input id="religious_use" value={formData.religious_use || ''} onChange={e => setFormData({ ...formData, religious_use: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="traditional_uses">Traditional Uses</Label>
                                <Input id="traditional_uses" value={formData.traditional_uses || ''} onChange={e => setFormData({ ...formData, traditional_uses: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="gi_status">GI Status</Label>
                                <Input id="gi_status" value={formData.gi_status || ''} onChange={e => setFormData({ ...formData, gi_status: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="fun_fact">Fun Fact / Trivia</Label>
                                <Input id="fun_fact" value={formData.fun_fact || ''} onChange={e => setFormData({ ...formData, fun_fact: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="insights">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Insights & Analysis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="col-span-2">
                                <Label htmlFor="key_takeaways">Key Takeaways</Label>
                                <Textarea id="key_takeaways" value={formData.key_takeaways || ''} onChange={e => setFormData({ ...formData, key_takeaways: e.target.value })} rows={2} />
                              </div>
                              <div className="col-span-2">
                                <Label>SWOT Analysis</Label>
                              </div>
                              <div>
                                <Label htmlFor="swot_strengths">Strengths</Label>
                                <Input id="swot_strengths" value={formData.swot_strengths || ''} onChange={e => setFormData({ ...formData, swot_strengths: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="swot_weaknesses">Weaknesses</Label>
                                <Input id="swot_weaknesses" value={formData.swot_weaknesses || ''} onChange={e => setFormData({ ...formData, swot_weaknesses: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="swot_opportunities">Opportunities</Label>
                                <Input id="swot_opportunities" value={formData.swot_opportunities || ''} onChange={e => setFormData({ ...formData, swot_opportunities: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="swot_threats">Threats</Label>
                                <Input id="swot_threats" value={formData.swot_threats || ''} onChange={e => setFormData({ ...formData, swot_threats: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                  <div className="flex justify-end gap-2 px-6 pb-6 border-t pt-4 bg-background/80 sticky bottom-0 z-10">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : editingCrop ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="search">Search Crops</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, scientific name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <Label htmlFor="season-filter">Season</Label>
            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="kharif">Kharif</SelectItem>
                <SelectItem value="rabi">Rabi</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Label htmlFor="climate-filter">Climate</Label>
            <Select value={climateFilter} onValueChange={setClimateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Climates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Climates</SelectItem>
                <SelectItem value="tropical">Tropical</SelectItem>
                <SelectItem value="subtropical">Subtropical</SelectItem>
                <SelectItem value="temperate">Temperate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCrops.length)} of {filteredCrops.length} crops
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <span className="text-sm font-medium">{itemsPerPage}</span>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCrops.length === paginatedCrops.length && paginatedCrops.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Scientific Name</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Climate Type</TableHead>
                <TableHead>Growth Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading crops...
                  </TableCell>
                </TableRow>
              ) : paginatedCrops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No crops found. {searchTerm || seasonFilter !== "all" || climateFilter !== "all" 
                      ? "Try adjusting your filters." 
                      : "Add your first crop to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCrops.map((crop) => (
                  <TableRow key={crop.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCrops.includes(crop.id)}
                        onCheckedChange={(checked) => handleSelectCrop(crop.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{crop.name}</TableCell>
                    <TableCell className="text-muted-foreground">{crop.scientific_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {crop.season?.map((season, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {season}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {crop.climate_type?.map((climate, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {climate}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{crop.growth_duration}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(crop)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(crop.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCropManagement;
import re
from typing import Optional
from app.providers.base import BaseAIProvider
from app.schemas import WasteAnalysisResult, WasteCategory


class MockHeuristicAIProvider(BaseAIProvider):
    """
    High-fidelity offline heuristic AI provider.
    Ensures zero-crash testing and immediate local prototype functionality
    even when network or API keys are unavailable.
    """

    @property
    def provider_name(self) -> str:
        return "Offline Heuristic (Built-in Fallback)"

    @property
    def model_name(self) -> str:
        return "heuristic-sustainability-v1"

    async def analyze(
        self,
        image_bytes: Optional[bytes] = None,
        mime_type: Optional[str] = None,
        text_prompt: Optional[str] = None
    ) -> WasteAnalysisResult:
        prompt = (text_prompt or "").lower().strip()

        # If an image was supplied without text, generate a reasonable generic image detection
        # or analyze filename/context if available
        if not prompt and image_bytes:
            # We acknowledge image presence: in mock mode without vision LLM, analyze as visual input
            return WasteAnalysisResult(
                detected_item="Recyclable Container / Beverage Bottle (Visual Estimation)",
                material="PET Plastic / Aluminum",
                waste_category=WasteCategory.DRY_RECYCLABLE,
                confidence=0.88,
                disposal_guidance="Rinse out any residual liquids, compress to save bin volume, and place in the dry recyclables bin.",
                explanation="Visual pattern matches standard beverage container geometry commonly collected in dry recycling streams.",
                sustainability_tip="Opt for reusable bottles to prevent recurring single-use container waste.",
                safety_note="Disposal rules vary by location. Follow your local municipality's waste-management guidelines."
            )

        # 1. Battery (Hazardous / Special)
        if any(w in prompt for w in ["battery", "lithium", "cell", "accumulator", "alkaline", "button cell"]):
            return WasteAnalysisResult(
                detected_item="Battery (Chemical Cell)",
                material="Heavy Metals / Lithium / Nickel / Cadmium",
                waste_category=WasteCategory.HAZARDOUS_SPECIAL,
                confidence=0.96,
                disposal_guidance="Do NOT throw in household trash or standard recycling bins. Tape the terminals with non-conductive electrical tape and deposit at an authorized battery collection kiosk or municipal hazardous depot.",
                explanation="Batteries contain toxic heavy metals and flammable electrolytes that can combust under pressure or contaminate groundwater in landfills.",
                sustainability_tip="Switch to rechargeable batteries (NiMH) to reduce heavy metal disposal frequency by over 90%.",
                safety_note="HIGH SAFETY RISK: Never puncture, crush, incinerate, or expose batteries to open flame."
            )

        # 2. Old mobile phone / Electronics (E-Waste)
        if any(w in prompt for w in ["phone", "smartphone", "mobile", "laptop", "tablet", "circuit", "charger", "cable", "e-waste", "motherboard", "screen"]):
            return WasteAnalysisResult(
                detected_item="Mobile Device / Electronics",
                material="Mixed Precious Metals, Silicon, Plastics & Glass",
                waste_category=WasteCategory.E_WASTE,
                confidence=0.95,
                disposal_guidance="Factory reset the device to wipe personal data, remove any removable battery, and take to a certified e-waste recycler or municipal electronic drop-off box.",
                explanation="Consumer electronics contain valuable gold, copper, and rare earths alongside lead solder; specialized recycling facilities safely recover precious metals.",
                sustainability_tip="Consider donating still-functioning devices or participating in brand buy-back and trade-in initiatives.",
                safety_note="Do not crush or dispose with regular household trash. Follow local e-waste management rules."
            )

        # 3. Banana peel / Organic waste (Wet / Organic)
        if any(w in prompt for w in ["banana", "peel", "apple", "fruit", "vegetable", "food scrap", "egg shell", "coffee ground", "leaves", "organic"]):
            return WasteAnalysisResult(
                detected_item="Fruit / Vegetable Scrap (Banana Peel)",
                material="Organic Compostable Biomass",
                waste_category=WasteCategory.WET_ORGANIC,
                confidence=0.98,
                disposal_guidance="Place in the green organic/wet waste bin, or add to a household vermicompost unit without plastic packaging.",
                explanation="Organic matter decomposes aerobically to generate nutrient-rich compost and humus rather than producing methane in anaerobic landfills.",
                sustainability_tip="Start a home compost bin to turn food scraps into rich fertilizer for indoor or community plants.",
                safety_note="Ensure all stickers and synthetic packaging are removed before composting."
            )

        # 4. Plastic water bottle (Dry / Recyclable)
        if any(w in prompt for w in ["plastic bottle", "water bottle", "pet bottle", "soda bottle", "beverage bottle"]):
            return WasteAnalysisResult(
                detected_item="Plastic Water Bottle",
                material="PET Plastic (#1 Polyethylene Terephthalate)",
                waste_category=WasteCategory.DRY_RECYCLABLE,
                confidence=0.96,
                disposal_guidance="Empty all liquid, rinse lightly if needed, flatten to conserve space, screw the cap back on, and deposit in the dry/recyclable stream.",
                explanation="PET is a high-demand thermoplastic polymer easily pelletized and spun into recycled polyester fiber or remanufactured into new bottles.",
                sustainability_tip="Carry a reusable insulated stainless steel water bottle to avoid single-use plastic waste.",
                safety_note="Disposal rules vary by location. Follow your local municipality's waste-management guidelines."
            )

        # 5. Cardboard box (Dry / Recyclable)
        if any(w in prompt for w in ["cardboard", "carton", "shipping box", "amazon box", "corrugated"]):
            return WasteAnalysisResult(
                detected_item="Corrugated Cardboard Box",
                material="Cellulose Wood Pulp / Paper Fiber",
                waste_category=WasteCategory.DRY_RECYCLABLE,
                confidence=0.94,
                disposal_guidance="Remove packing tape and foam inserts, flatten the box completely to optimize storage, and place in the paper/cardboard recycling bin. Keep dry.",
                explanation="Clean corrugated cardboard fibers can be repulped and recycled between 5 to 7 times into new packaging materials.",
                sustainability_tip="Reuse sturdy shipping boxes for home storage or gift mailing before recycling.",
                safety_note="Soiled cardboard with heavy oil or grease belongs in wet/general waste, not paper recycling."
            )

        # 6. Used tissue / Napkin (General / Non-recyclable)
        if any(w in prompt for w in ["tissue", "napkin", "paper towel", "toilet paper", "used wipe", "facial tissue"]):
            return WasteAnalysisResult(
                detected_item="Used Tissue / Paper Towel",
                material="Degraded Cellulose Short Fibers (Soiled)",
                waste_category=WasteCategory.GENERAL_NON_RECYCLABLE,
                confidence=0.92,
                disposal_guidance="Place in the general / non-recyclable waste bin (or designated organic bin only if unbleached and explicitly permitted by local compost facilities).",
                explanation="Tissue paper fibers are too short to be recycled into new paper products, and used tissues frequently carry biological contaminants and moisture.",
                sustainability_tip="Use washable cloth towels and handkerchiefs for household cleaning to avoid disposable tissue waste.",
                safety_note="Wrap sanitarily if contaminated with bodily fluids or cleaning disinfectants."
            )

        # 7. Aluminum can (Dry / Recyclable)
        if any(w in prompt for w in ["can", "aluminum", "tin can", "soda can", "beverage can", "coke can"]):
            return WasteAnalysisResult(
                detected_item="Aluminum Beverage Can",
                material="Aluminum Alloy",
                waste_category=WasteCategory.DRY_RECYCLABLE,
                confidence=0.97,
                disposal_guidance="Empty any liquid residue, lightly rinse, and place directly into the dry recycling stream. No need to remove the pull-tab.",
                explanation="Aluminum can be recycled infinitely without quality degradation, saving 95% of the energy needed to produce primary aluminum from bauxite ore.",
                sustainability_tip="Aluminum has one of the highest recycling return efficiencies globally; keep metal streams segregated.",
                safety_note="Take caution with sharp opened edges when handling crushed metal cans."
            )

        # 8. Food container (Clean vs Greasy / Soiled)
        if any(w in prompt for w in ["container", "takeout", "food box", "tupperware", "styrofoam", "pizza"]):
            if any(w in prompt for w in ["greasy", "oil", "food residue", "dirty", "soiled", "pizza box"]):
                return WasteAnalysisResult(
                    detected_item="Greasy / Soiled Food Container",
                    material="Oil-Contaminated Paperboard / Plastic",
                    waste_category=WasteCategory.GENERAL_NON_RECYCLABLE,
                    confidence=0.89,
                    disposal_guidance="Place in the general / non-recyclable waste bin. Grease and cheese grease permanently bind to paper fibers, making repulping impossible.",
                    explanation="Grease contamination ruins paper recycling batches by preventing fibers from bonding. Clean parts of the container can be separated for recycling.",
                    sustainability_tip="Support restaurants offering returnable packaging or bring your own reusable container for takeout.",
                    safety_note="Disposal rules vary by location. Follow your local municipality's waste-management guidelines."
                )
            else:
                return WasteAnalysisResult(
                    detected_item="Clean Takeaway / Food Container",
                    material="Polypropylene (PP #5) / Polystyrene",
                    waste_category=WasteCategory.DRY_RECYCLABLE,
                    confidence=0.88,
                    disposal_guidance="Rinse thoroughly to remove food grease or sauces, check bottom for resin code #5 or #1, and place in dry recyclables bin.",
                    explanation="Rigid plastic containers free from food residue are mechanically sorted and pelletized for industrial reuse.",
                    sustainability_tip="Reuse food grade polypropylene tubs for leftover storage or organizing small household items.",
                    safety_note="Disposal rules vary by location. Follow your local municipality's waste-management guidelines."
                )

        # 9. Glass bottle (Dry / Recyclable)
        if any(w in prompt for w in ["glass", "wine bottle", "beer bottle", "jar", "olive oil bottle"]):
            return WasteAnalysisResult(
                detected_item="Glass Bottle / Jar",
                material="Soda-Lime Silica Glass",
                waste_category=WasteCategory.DRY_RECYCLABLE,
                confidence=0.96,
                disposal_guidance="Empty and rinse clean. Remove metal or plastic lids (sort them into their respective metal/plastic bins). Deposit in the glass/dry recycling bin.",
                explanation="Container glass is 100% recyclable and can be melted down repeatedly into cullet without loss of purity or clarity.",
                sustainability_tip="Glass jars can easily be sterilized and repurposed as durable pantry food containers.",
                safety_note="Do not mix broken window panes or light bulbs into container glass; their chemical melting points differ."
            )

        # 10. Mixed waste / Ambiguous item (Uncertain / Responsible AI handling)
        if any(w in prompt for w in ["mixed", "unknown", "debris", "trash", "stuff", "junk", "rubbish"]) or len(prompt) < 4:
            return WasteAnalysisResult(
                detected_item="Uncertain / Mixed Debris",
                material="Multiple Composite Unseparated Materials",
                waste_category=WasteCategory.UNCERTAIN,
                confidence=0.42,
                disposal_guidance="Manually separate distinct components if feasible (e.g. detach plastic films from paper). If components cannot be separated, place in general non-recyclable waste to avoid contaminating recycling streams.",
                explanation="Responsible AI requirement: The item description lacks distinguishing visual or structural features to assign a single waste bin with high confidence.",
                sustainability_tip="Avoid purchasing products with fused non-separable multi-material packaging (like foil-lined plastic pouches).",
                safety_note="Disposal rules vary by location. Follow your local municipality's waste-management guidelines."
            )

        # General Fallback
        return WasteAnalysisResult(
            detected_item=text_prompt.capitalize(),
            material="Mixed Consumer Goods",
            waste_category=WasteCategory.GENERAL_NON_RECYCLABLE,
            confidence=0.70,
            disposal_guidance="If clean and made of unmixed plastic/metal/paper, sort into dry recyclables. If soiled or composite, dispose in general non-recyclable waste.",
            explanation="Classified based on general consumer waste segregation heuristics. When uncertain, keeping recyclables free of contamination is prioritized.",
            sustainability_tip="Check the packaging for resin identification codes or recyclable logo stamps before disposal.",
            safety_note="Disposal rules vary by location. Follow your local municipality's waste-management guidelines."
        )

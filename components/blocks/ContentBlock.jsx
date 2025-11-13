import {
  Move,
  Trash2,
  Type,
  Image,
  List,
  Quote,
  Play,
  Users,
  BarChart3,
  Calendar,
  HelpCircle,
  Target,
  FileText,
  MapPin,
  Award,
  BookOpen,
  Heart,
  Users as UsersIcon,
  UserCheck,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import {
  TextBlock,
  ImageBlock,
  ListBlock,
  QuoteBlock,
  VideoBlock,
  TestimonialBlock,
  StatsBlock,
  TimelineBlock,
  FaqBlock,
  CtaBlock,
  FileBlock,
  MapBlock,
  AwardBlock,
  ProgrammeBlock,
  ServicesBlock,
  SponsorshipBlock,
  ImpactBlock,
  TeamBlock,
} from "./ContentBlockComponents.jsx";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const DARK_TEXT = "#333333"; // Dark Gray
const DELETE_COLOR = "#EF4444"; // Standard Red for error/delete

export default function ContentBlock({
  block,
  index,
  contentTypes,
  updateContentBlock,
  removeContentBlock,
  handleDragStart,
  handleDragOver,
  handleDrop,
  isEditing = false, // New prop to determine if we're in editing mode
}) {
  const Icon =
    contentTypes.find((type) => type.type === block.type)?.icon || Type;

  const renderBlockContent = () => {
    if (isEditing) {
      // Editing mode - render form inputs for each block type
      switch (block.type) {
        case "text":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <TextBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "image":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ImageBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "list":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ListBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "quote":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <QuoteBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "video":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <VideoBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "testimonial":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <TestimonialBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "stats":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <StatsBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "timeline":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <TimelineBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "faq":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <FaqBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "cta":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <CtaBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "file":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <FileBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "map":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <MapBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "award":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <AwardBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "programme":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ProgrammeBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "services":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ServicesBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "sponsorship":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <SponsorshipBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "impact":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ImpactBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        case "team":
          return (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 capitalize">{block.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentBlock(block.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <TeamBlock
                block={block}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
              />
            </div>
          );
        default:
          return (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-500">
                Type de bloc non supporté pour l'édition.
              </p>
            </div>
          );
      }
    }

    // Display-only mode - render content without interactive components
    switch (block.type) {
      case "text":
        return (
          <div className="mb-6">
            {block.content.heading && (
              <h3
                className="text-2xl font-bold mb-4 border-b pb-2"
                style={{ color: "#1a629b", borderColor: "#358dce" }}
              >
                {block.content.heading}
              </h3>
            )}
            <div
              className="leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: block.content.text }}
            />
          </div>
        );
      case "programme":
        return (
          <div
            className="mb-8 p-6 rounded-lg border-l-4"
            style={{
              background: "linear-gradient(to right, #e8f4fd, #f0f9ff)",
              borderColor: "#1a629b",
            }}
          >
            {block.content.heading && (
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#1a629b" }}
              >
                {block.content.heading}
              </h3>
            )}
            <div className="space-y-4">
              {block.content.modules &&
                block.content.modules.map((module, moduleIndex) => (
                  <div
                    key={moduleIndex}
                    className="bg-white p-4 rounded-md shadow-sm"
                  >
                    <h4
                      className="font-semibold text-lg mb-2"
                      style={{ color: "#358dce" }}
                    >
                      {module.title}
                    </h4>
                    {module.duration && (
                      <p className="text-sm mb-1" style={{ color: "#63a94f" }}>
                        Durée: {module.duration}
                      </p>
                    )}
                    <p className="text-gray-700 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                ))}
              {block.content.duration && (
                <div
                  className="mt-4 p-3 rounded-md"
                  style={{ backgroundColor: "#e8f4fd" }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#1a629b" }}
                  >
                    Durée totale: {block.content.duration}
                  </p>
                </div>
              )}
              {block.content.certification && (
                <div
                  className="mt-2 p-3 rounded-md"
                  style={{ backgroundColor: "#e8f5e8" }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#3c8f43" }}
                  >
                    Certification: {block.content.certification}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "list":
        return (
          <div className="mb-6">
            {block.content.title && (
              <h3
                className="text-xl font-bold mb-4 border-b pb-2"
                style={{ color: "#1a629b", borderColor: "#358dce" }}
              >
                {block.content.title}
              </h3>
            )}
            <ul className="list-disc pl-8 space-y-2">
              {block.content.items &&
                block.content.items.map((item, i) => (
                  <li
                    key={`item-${i}`}
                    className="leading-relaxed text-gray-700"
                  >
                    {item}
                  </li>
                ))}
            </ul>
          </div>
        );
      case "services":
        return (
          <div
            className="mb-8 p-6 rounded-lg border-l-4"
            style={{
              background: "linear-gradient(to right, #f0f9f0, #e8f5e8)",
              borderColor: "#3c8f43",
            }}
          >
            {block.content.heading && (
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#3c8f43" }}
              >
                {block.content.heading}
              </h3>
            )}
            <div className="space-y-6">
              {block.content.categories &&
                block.content.categories.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-white p-4 rounded-md shadow-sm"
                  >
                    <h4
                      className="font-semibold text-lg mb-3"
                      style={{ color: "#63a94f" }}
                    >
                      {category.name}
                    </h4>
                    <div className="space-y-2">
                      {category.services &&
                        category.services.map((service, serviceIndex) => (
                          <div
                            key={serviceIndex}
                            className="border-l-2 pl-3"
                            style={{ borderColor: "#63a94f" }}
                          >
                            <h5 className="font-medium text-gray-800">
                              {service.name}
                            </h5>
                            <p className="text-gray-600 text-sm">
                              {service.description}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      case "sponsorship":
        return (
          <div
            className="mb-8 p-6 rounded-lg border-l-4"
            style={{
              background: "linear-gradient(to right, #fff8e1, #fff3c4)",
              borderColor: "#e05e47",
            }}
          >
            {block.content.heading && (
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#c33a33" }}
              >
                {block.content.heading}
              </h3>
            )}
            <div className="space-y-4">
              {block.content.formulas &&
                block.content.formulas.map((formula, formulaIndex) => (
                  <div
                    key={formulaIndex}
                    className="bg-white p-4 rounded-md shadow-sm border-l-3"
                    style={{ borderColor: "#e05e47" }}
                  >
                    <h4
                      className="font-semibold text-lg mb-2"
                      style={{ color: "#e05e47" }}
                    >
                      {formula.name}
                    </h4>
                    {formula.amount && (
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: "#c33a33" }}
                      >
                        Montant: {formula.amount}
                      </p>
                    )}
                    <p className="text-gray-700 leading-relaxed">
                      {formula.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        );
      case "timeline":
        return (
          <div
            className="mb-8 p-6 rounded-lg border-l-4"
            style={{
              background: "linear-gradient(to right, #f3e5f5, #fce4ec)",
              borderColor: "#358dce",
            }}
          >
            {block.content.heading && (
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#1a629b" }}
              >
                {block.content.heading}
              </h3>
            )}
            <div className="space-y-4">
              {block.content.events &&
                block.content.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="bg-white p-4 rounded-md shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: "#358dce" }}
                      >
                        {eventIndex + 1}
                      </div>
                      <div className="flex-1">
                        <div
                          className="font-medium text-sm mb-1"
                          style={{ color: "#63a94f" }}
                        >
                          {event.year}
                        </div>
                        <h4
                          className="font-semibold text-lg mb-1"
                          style={{ color: "#1a629b" }}
                        >
                          {event.title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      case "stats":
        return (
          <div
            className="mb-8 p-6 rounded-lg border-l-4"
            style={{
              background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
              borderColor: "#358dce",
            }}
          >
            {block.content.heading && (
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#1a629b" }}
              >
                {block.content.heading}
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {block.content.stats &&
                block.content.stats.map((stat, statIndex) => (
                  <div
                    key={statIndex}
                    className="bg-white p-4 rounded-md shadow-sm text-center"
                  >
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: "#358dce" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-700">{stat.label}</div>
                  </div>
                ))}
            </div>
          </div>
        );
      case "impact":
        return (
          <div
            className="mb-8 p-6 rounded-lg border-l-4"
            style={{
              background: "linear-gradient(to right, #ffebee, #ffcdd2)",
              borderColor: "#c33a33",
            }}
          >
            {block.content.heading && (
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#c33a33" }}
              >
                {block.content.heading}
              </h3>
            )}
            <div className="space-y-3">
              {block.content.impacts &&
                block.content.impacts.map((impact, impactIndex) => (
                  <div
                    key={impactIndex}
                    className="bg-white p-4 rounded-md shadow-sm"
                  >
                    <h4
                      className="font-semibold text-lg mb-1"
                      style={{ color: "#c33a33" }}
                    >
                      {impact.description}
                    </h4>
                    <p className="text-gray-600">{impact.value}</p>
                  </div>
                ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500">
              Contenu non disponible pour ce type de bloc.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`content-block ${isEditing ? 'content-block-edit' : 'content-block-display prose prose-lg max-w-none'}`}>
      {renderBlockContent()}
    </div>
  );
}

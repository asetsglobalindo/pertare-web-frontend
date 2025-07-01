export interface ImageType {
  _id: string;
  title: string;
  description: string;
  button_name: string;
  button_route: string;
  images:
    | {
        url: string;
      }[]
    | [];
  images_mobile:
    | {
        url: string;
      }[]
    | [];
}

export interface LocationType {
  created_at: string;
  _id: string;
  name: string;
  slug: string;
  code: string;
  listing_code: string;
  address: string;
  lat: string;
  long: string;
  facility: string;
  fuel: string;
  publish: number;
  operational_hour: string;
}

export interface HeaderItemChild {
  name: string;
  route: string;
  order: number;
  images: [] | [];
  _id: string;
  childs: HeaderItemChild[] | [];
}

export interface PagesResponseType {
  current_page: number;
  total_data: number;
}

export interface HeaderItemType {
  name: string;
  _id: string;
  route: string;
  order: number;
  images: [] | [];
  active_status: boolean;
  childs: HeaderItemChild[] | [];
  contents: [];
  organization_id: string;
}

interface CategoryContentType {
  name: string;
  slug: string;
  _id: string;
}

interface ContentItemType {
  small_text: string;
  title: string;
  description: string;
  _id: string;
  order: number;
  thumbnail_images: ImageType[] | [];
  category_id: CategoryContentType;
}

export interface ContentType {
  meta_title: string;
  meta_description: string;
  title: string;
  _id: string;
  type: number;
  category_id: {
    name: string;
    _id: string;
  };
  small_text: string;
  small_text2: string;
  sub_title1: string;
  sub_title2: string;
  sub_title3: string;
  slug: string;
  description: string;
  banner: ImageType[] | [];
  use_list: boolean;
  show_on_homepage: boolean;
  body:
    | {
        title: string;
        text: string;
        button_name: string;
        type: number;
        image_size: number;
        images: ImageType[] | [];
        button_route: string;
        _id: string;
        lists: [];
      }[]
    | [];
  body2: { _id: string; title: string; text: string }[];
  active_status: boolean;
  total_view: number;
  order: number;
  images: ImageType[] | [];
  images2: ImageType[] | [];
  thumbnail_images: ImageType[] | [];
  thumbnail_images2: ImageType[] | [];
  related: [];
  related2: [];
  organization_id: string;
  bottom_text2: string;
  bottom_description2: string;
  created_at: string;
  bottom_button_route: string;
  bottom_text: string;
  bottom_button_name: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  // Sustainability Commitment fields
  sustainability_commitment_title?: string;
  sustainability_commitment_ceo_name?: string;
  sustainability_commitment_ceo_position?: string;
  sustainability_commitment_ceo_image?: ImageType[] | [];
  sustainability_commitment_ceo_quote?: string;
}

interface Tab {
  title: string;
  content: ContentItemType[];
  image: ImageType;
  _id: string;
}

interface NewsContent {
  meta_title: string;
  meta_description: string;
  created_at: string;
  small_text: string;
  title: string;
  description: string;
  _id: string;
  order: number;
  slug: string;
  thumbnail_images: ImageType[] | [];
  category_id: CategoryContentType;
}

export interface HomeType {
  meta_title: string;
  meta_description: string;
  banner: ImageType[] | [];
  section2: {
    title: string;
    tab: Tab[] | [];
  };
  section3: {
    small_text: string;
    title: string;
  };
  section4a: {
    description: string;
    title: string;
    content: ContentType[] | [];
  };
  section4:
    | {
        diagram1: ChartData[];
        diagram2: ChartData[];
        _id: string;
        title: string;
        tab: string;
        description: string;
        image: ImageType;
      }[]
    | [];
  section5: {
    title: string;
    button_name: string;
    button_route: string;
    content: NewsContent[] | [];
  };
}

export interface OtherRoute {
  title: string;
  route: string;
  order: number;
  _id: string;
}

export interface FooterType {
  tagline: string;
  _id: string;
  url_instagram: string;
  url_facebook: string;
  url_linkedin: string;
  url_mail: string;
  address: string;
  mail: string;
  tel: string;
  copyright_text: string;
  copyright_link: string;
  created_at: string;
  created_by: string;
  __v: number;
  other_routes: OtherRoute[];
  updated_at: string;
  updated_by: string;
}

export interface ChartConfig {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export interface ChartDataProps {
  data: {
    year: string;
    [key: string]: number | string;
  }[];
  activeKeyIndex?: number;
}

type ChartData = {
  year: string;
  [key: string]: number | string; // Dynamic keys for each series
};

export interface BarChartProps {
  data: ChartData[];
  activeKeyIndex: number;
}

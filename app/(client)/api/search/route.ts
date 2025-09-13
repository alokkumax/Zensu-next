import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, getAllCategories } from '@/sanity/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type');

  try {
    if (type === 'products' && query) {
      const products = await searchProducts(query, 4);
      return NextResponse.json({ products });
    } else if (type === 'categories') {
      const categories = await getAllCategories();
      return NextResponse.json({ categories });
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

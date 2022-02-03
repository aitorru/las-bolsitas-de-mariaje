import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_KEY || '';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (req.nextUrl.pathname === '/fire' && req.cookies.token) {
        if (jwt.verify(req.cookies.token.split(' ')[1], SECRET_KEY)) {
            return NextResponse.redirect('/dboard');
        }
    }
    if (req.nextUrl.pathname === '/dboard' && !req.cookies.token) {
        return NextResponse.redirect('/fire');
    }
    if (req.nextUrl.pathname === '/dboard' && req.cookies.token) {
        if (jwt.verify(req.cookies.token.split(' ')[1], SECRET_KEY)) {
            return NextResponse.next();
        }
        return NextResponse.redirect('/fire');
    }
    return NextResponse.next();
}

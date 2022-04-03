import { NextRequest, NextResponse } from 'next/server';
//import jwt from 'jsonwebtoken';
import jwt from '@tsndr/cloudflare-worker-jwt';
const SECRET_KEY = process.env.JWT_KEY || '';

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === '/fire' && req.cookies.token) {
        try {
            if (await jwt.verify(req.cookies.token.split(' ')[1], SECRET_KEY)) {
                return NextResponse.redirect('/dboard');
            }
        } catch (error) {
            return NextResponse.next();
        }
        
    }
    if (req.nextUrl.pathname === '/dboard' && !req.cookies.token) {
        return NextResponse.redirect('/fire');
    }
    if (req.nextUrl.pathname === '/dboard' && req.cookies.token) {
        if (await jwt.verify(req.cookies.token.split(' ')[1], SECRET_KEY)) {
            return NextResponse.next();
        }
        return NextResponse.redirect('/fire');
    }
    return NextResponse.next();
}

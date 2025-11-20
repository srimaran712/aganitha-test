import { isValidUrl } from "../service/validation.js";
import { isValidCode } from "../service/validation.js";
import { generateCode } from "../service/validation.js";
import {LinkModel} from "../models/link.model.js";
import db from "../db/connection.js";
import dotenv from 'dotenv'
dotenv.config()


//assigning the model to the variable
const Link=LinkModel(db)
export class UrlShortenerController {

    constructor(targetUrl,code){
        this.targetUrl=targetUrl
        this.code=code
    }

  //create url shortener
    static  async createUrlShortener(req,res){
        try{
             const {targetUrl,code:rawCode}=req.body
        if (!targetUrl || !isValidUrl(targetUrl)) {
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    let code = rawCode;

    // Validate custom code format if provided
    if (code && !isValidCode(code)) {
      return res.status(400).json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
    }

    // Generate code if not provided
    if (!code) {
      // Try to generate unique code
      for (let i = 0; i < 5; i++) {
        const candidate = generateCode(6);
        const exists = await Link.findOne({ where: { short_url: candidate } });
        if (!exists) {
          code = candidate;
          break;
        }
      }
      if (!code) return res.status(500).json({ error: 'Failed to generate unique code' });
    } else {
      // Check custom code unique
      const exists = await Link.findOne({ where: { short_url:code } });
      if (exists) return res.status(409).json({ error: 'Code already exists' });
    }

    const link = await Link.create({ short_url:code, target_url: targetUrl });
    return res.status(201).json({ message:'url shortener created successfully',link });
        }catch(err){
            console.log(err)
            return res.status(500).json({ error: 'Failed to create url shortener , something internal error occurred' });
        }
       
    }
  
    //get all the links 
    static async getAllLinks(req,res){
        try{
        const links = await Link.findAll();
        if (!links) return res.status(404).json({ error: 'No links found' });
       console.log(links)
        //adding custom changes in the link 
        const customLinks = links.map(link => ({
            id: link.id,
            code: link.short_url,
            short_url: `${process.env.BASE_URL}/${link.short_url}`,
            url: link.target_url,
            total_clicks: link.total_clicks,
            last_clicked_at: link.last_clicked_at
          }));
        return res.status(200).json({ message:'all links fetched successfully',generatedLinks:customLinks });
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Failed to fetch all links , something internal error occurred' });
    }
    }
    //view the link details and stats
    static async getLinkStats(req,res){
        try{
        const {code}=req.params
        const link = await Link.findOne({ where: { short_url:code } });
        if (!link) return res.status(404).json({ error: 'Link not found' });
        return res.status(200).json({ message:'link stats fetched successfully', link:{
    code: link.short_url,
    url: link.target_url,
    totalClicks: link.total_clicks,
    lastClickedAt: link.last_clicked_at,
    createdAt: link.created_at,
    shortUrl: `${process.env.BASE_URL}/${link.short_url}`,
   }});
}catch(err){
    console.log(err)
    return res.status(500).json({ error: 'Failed to fetch link stats , something internal error occurred' });
}

   
    }

    static async deleteLink(req,res){
        try{
        const {code}=req.params
        const link = await Link.findOne({ where: { short_url:code } });
        if (!link) return res.status(404).json({ error: 'Link not found' });
        await link.destroy();
        return res.status(200).json({ message:'link deleted successfully' });
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Failed to delete link , something internal error occurred' });
    }
    }

    static async redirect(req,res){
        try{
            const {code}=req.params
            const link = await Link.findOne({ where: { short_url:code } });
            if (!link) return res.status(404).json({ error: 'Link not found' });
              link.total_clicks = (link.total_clicks || 0) + 1;
             link.last_clicked_at = new Date();
      await link.save();
     return res.status(302).json({ message:'link redirected successfully',url:link.target_url});
    //  return res.redirect(302, link.target_url);
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Failed to fetch link stats , something internal error occurred' });
    }
    }

}

    


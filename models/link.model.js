import { table } from "console";
import { DataTypes } from "sequelize";


export const LinkModel = (sequelize)=>{
    const Link = sequelize.define('link', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        target_url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        short_url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        total_clicks:{
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        last_clicked_at:{
            type: DataTypes.DATE,
            allowNull: true,
          
        }

    },{
        timestamps:true,
        createdAt:'created_at',
        updatedAt:'updated_at',
        tableName:'links'
    })

    return Link
}